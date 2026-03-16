import { useEffect, useState } from "react";
import StudentLayout from "../components/layout/StudentLayout";
import api from "../api";
import socket from "../services/socket";

export default function ProctorDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [runtimeLogs, setRuntimeLogs] = useState([]);
  const [behaviorLogs, setBehaviorLogs] = useState([]);

  const [riskProbability, setRiskProbability] = useState(0);

  const [finalVerdict, setFinalVerdict] = useState(null);
  const [questionSummary, setQuestionSummary] = useState([]);
  const [examScore, setExamScore] = useState(null);
  const [maxScore, setMaxScore] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get("/exams/live");
        setExams(res.data || []);
      } catch (err) {
        console.error("Failed to fetch live exams:", err);
      }
    };

    fetchExams();
  }, []);

  useEffect(() => {
    if (!selectedStudent) return;

    const fetchRuntimeLogs = async () => {
      try {
        const res = await api.get(`/detections/session/${selectedStudent.id}`);
        setRuntimeLogs(res.data || []);
      } catch (err) {
        console.error("Runtime logs fetch error:", err);
      }
    };

    fetchRuntimeLogs();
  }, [selectedStudent]);

  useEffect(() => {
    if (!selectedStudent) return;

    const fetchBehaviorLogs = async () => {
      try {
        const res = await api.get(
          `/aggregation/${selectedStudent.id}/behavioral-report`,
        );

        setBehaviorLogs(res.data || []);
      } catch (err) {
        console.error("Behavioral logs fetch error:", err);
      }
    };

    fetchBehaviorLogs();
  }, [selectedStudent]);

  useEffect(() => {
    if (!selectedStudent) return;

    const sessionId = selectedStudent.id;

    socket.emit("join_session", sessionId);

    const handleAlert = (alert) => {
      if (alert.session_id !== sessionId) return;

      if (alert.event_type === "behavioral") {
        setBehaviorLogs((prev) => [
          {
            question_index: alert.question_index,
            final_label: alert.severity,
            avg_probability: alert.confidence_level,
            detected_at: alert.detected_at,
          },
          ...prev,
        ]);
      }

      if (
        alert.event_type === "object injection" ||
        alert.event_type === "scene tampering"
      ) {
        setRuntimeLogs((prev) => [alert, ...prev]);
      }
    };

    const handleLiveStatus = (data) => {
      if (data.session_id === sessionId) {
        setRiskProbability(data.prob_cheat);
      }
    };

    const handleSessionFinalized = (data) => {
      if (data.session_id !== sessionId) return;

      setFinalVerdict(data.final_verdict);
      setRiskProbability(data.overall_probability);
      setQuestionSummary(data.question_summary || []);
      setExamScore(data.score);
      setMaxScore(data.max_score);
    };

    socket.on("new_alert", handleAlert);
    socket.on("live_status", handleLiveStatus);
    socket.on("session_finalized", handleSessionFinalized);

    return () => {
      socket.emit("leave_session", sessionId);

      socket.off("new_alert", handleAlert);
      socket.off("live_status", handleLiveStatus);
      socket.off("session_finalized", handleSessionFinalized);
    };
  }, [selectedStudent]);

  const riskColor = (p) => {
    if (p > 0.8) return "bg-red-600";
    if (p > 0.5) return "bg-yellow-500";
    return "bg-green-600";
  };

  const totalSessions = exams.reduce((acc, exam) => {
    return acc + (exam.sessions?.length || 0);
  }, 0);

  const flaggedSessions = exams.reduce((acc, exam) => {
    const flagged =
      exam.sessions?.filter((s) => s.status === "flagged").length || 0;

    return acc + flagged;
  }, 0);

  void runtimeLogs;

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* NAVIGATION */}

        <div className="flex space-x-8 border-b pb-3">
          {["overview", "sessions"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedExam(null);
                setSelectedStudent(null);
              }}
              className={`capitalize pb-2 ${
                activeTab === tab
                  ? "border-b-2 border-red-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}

        {activeTab === "overview" && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white shadow rounded p-4">
              <p className="text-sm text-gray-500">Active Examinees</p>
              <p className="text-2xl font-bold">{totalSessions}</p>
            </div>

            <div className="bg-white shadow rounded p-4">
              <p className="text-sm text-gray-500">Flagged Sessions</p>
              <p className="text-2xl font-bold text-red-600">
                {flaggedSessions}
              </p>
            </div>

            <div className="bg-white shadow rounded p-4">
              <p className="text-sm text-gray-500">System Status</p>
              <p className="text-2xl font-bold text-green-600">Monitoring</p>
            </div>
          </div>
        )}

        {/* SESSIONS */}

        {activeTab === "sessions" && (
          <div className="bg-white shadow rounded p-6">
            {/* EXAM LIST */}

            {!selectedExam && (
              <>
                <h3 className="font-semibold mb-4">Exam Sessions</h3>

                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    onClick={() => setSelectedExam(exam)}
                    className="border rounded p-3 mb-3 cursor-pointer hover:shadow"
                  >
                    {exam.title}
                  </div>
                ))}
              </>
            )}

            {/* EXAMINEE LIST */}

            {selectedExam && !selectedStudent && (
              <>
                <button
                  onClick={() => setSelectedExam(null)}
                  className="text-sm text-gray-500 mb-4"
                >
                  ← Back
                </button>

                <h3 className="font-semibold mb-4">{selectedExam.title}</h3>

                {selectedExam.sessions?.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => {
                      setSelectedStudent(student);
                      setRiskProbability(0);
                      setFinalVerdict(null);
                    }}
                    className="border rounded p-3 mb-2 cursor-pointer hover:shadow flex justify-between"
                  >
                    <span>{student.examinee_name}</span>
                    <span className="text-sm text-gray-500">
                      {student.status}
                    </span>
                  </div>
                ))}
              </>
            )}

            {/* MONITORING VIEW */}

            {selectedExam && selectedStudent && (
              <>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-sm text-gray-500 mb-4"
                >
                  ← Back to Examinees
                </button>

                <h2 className="text-xl font-semibold">
                  {selectedStudent.examinee_name}
                </h2>

                <p className="text-sm text-gray-600">{selectedExam.title}</p>

                <div className="flex gap-6 text-sm text-gray-600 mt-1">
                  <span>Status: {selectedStudent.status}</span>
                  <span>
                    Score: {examScore ?? 0}/{maxScore ?? 0}
                  </span>
                </div>

                {/* AI THREAT BAR */}

                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    AI Threat Probability
                  </p>

                  <div className="w-full h-4 bg-gray-200 rounded">
                    <div
                      className={`${riskColor(riskProbability)} h-4 rounded`}
                      style={{ width: `${riskProbability * 100}%` }}
                    />
                  </div>

                  <p className="text-sm mt-2">
                    {(riskProbability * 100).toFixed(2)}%
                  </p>
                </div>

                {/* FINAL VERDICT */}

                <div className="mt-6 border rounded p-4">
                  <h3 className="font-semibold mb-2">AI Session Verdict</h3>

                  <p>
                    Behavioral:{" "}
                    {finalVerdict ? finalVerdict.toUpperCase() : "PROCESSING"}
                  </p>

                  <p>Confidence: {(riskProbability * 100).toFixed(2)}%</p>

                  {questionSummary.length > 0 && (
                    <div className="mt-3">
                      <p className="font-semibold text-sm mb-1">
                        Question Summary
                      </p>

                      {questionSummary.map((q) => (
                        <p key={q.question_index} className="text-sm">
                          Q{q.question_index} — {q.verdict.toUpperCase()}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* BEHAVIORAL TIMELINE */}

                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Behavioral Timeline</h3>

                  {behaviorLogs.map((log, idx) => (
                    <div key={idx} className="mb-3 text-sm">
                      <p className="font-medium">
                        {log.detected_at
                          ? new Date(log.detected_at).toLocaleTimeString()
                          : "--"}{" "}
                        — Q{log.question_index ?? "-"} — {log.final_label}
                      </p>

                      <p className="text-xs text-gray-500">
                        Confidence: {(log.avg_probability * 100).toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
