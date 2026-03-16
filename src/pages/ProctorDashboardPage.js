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

  /*
  ==================================================
  FETCH LIVE EXAMS
  ==================================================
  */

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

  /*
  ==================================================
  FETCH RUNTIME SECURITY LOGS
  ==================================================
  */

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

  /*
  ==================================================
  FETCH BEHAVIORAL TIMELINE
  ==================================================
  */

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

  /*
  ==================================================
  SOCKET.IO REAL-TIME MONITORING
  ==================================================
  */

  useEffect(() => {
    if (!selectedStudent) return;

    const sessionId = selectedStudent.id;

    socket.emit("join_session", sessionId);

    console.log("🔗 Monitoring session:", sessionId);

    /*
    ==========================
    ALERT HANDLER
    ==========================
    */

    const handleAlert = (alert) => {
      if (alert.session_id !== sessionId) return;

      console.log("🚨 Alert received:", alert);

      /*
      Behavioral AI Detection
      */

      if (alert.event_type === "behavioral") {
        setBehaviorLogs((prev) => [
          {
            question_index: alert.question_index,
            final_label: alert.severity,
            avg_probability: alert.confidence_level,
          },
          ...prev,
        ]);
      }

      /*
      Runtime Security Logs
      */

      if (
        alert.event_type === "object injection" ||
        alert.event_type === "scene tampering"
      ) {
        setRuntimeLogs((prev) => [alert, ...prev]);
      }
    };

    /*
    ==========================
    LIVE AI RISK SCORE
    ==========================
    */

    const handleLiveStatus = (data) => {
      if (data.session_id === sessionId) {
        console.log("📊 Live AI probability:", data.prob_cheat);
        setRiskProbability(data.prob_cheat);
      }
    };

    socket.on("new_alert", handleAlert);
    socket.on("live_status", handleLiveStatus);

    return () => {
      socket.emit("leave_session", sessionId);

      socket.off("new_alert", handleAlert);
      socket.off("live_status", handleLiveStatus);
    };
  }, [selectedStudent]);

  /*
  ==================================================
  RISK BAR COLOR
  ==================================================
  */

  const riskColor = (p) => {
    if (p > 0.8) return "bg-red-600";
    if (p > 0.5) return "bg-yellow-500";
    return "bg-green-600";
  };

  /*
  ==================================================
  OVERVIEW STATS
  ==================================================
  */

  const totalSessions = exams.reduce((acc, exam) => {
    return acc + (exam.sessions?.length || 0);
  }, 0);

  const flaggedSessions = exams.reduce((acc, exam) => {
    const flagged =
      exam.sessions?.filter((s) => s.status === "flagged").length || 0;

    return acc + flagged;
  }, 0);

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* NAV TABS */}

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
          <div className="space-y-6">
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
          </div>
        )}

        {/* SESSIONS TAB */}

        {activeTab === "sessions" && (
          <div className="bg-white shadow rounded p-6">
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

            {selectedExam && !selectedStudent && (
              <>
                <button
                  onClick={() => setSelectedExam(null)}
                  className="text-sm text-gray-500 mb-4"
                >
                  ← Back
                </button>

                <h3 className="font-semibold mb-4">{selectedExam.title}</h3>

                {selectedExam.sessions.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => {
                      setSelectedStudent(student);
                      setRiskProbability(0);
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

            {selectedExam && selectedStudent && (
              <>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-sm text-gray-500 mb-4"
                >
                  ← Back to Examinees
                </button>

                {/* STUDENT HEADER */}

                <div>
                  <h2 className="text-xl font-semibold">
                    {selectedStudent.examinee_name}
                  </h2>

                  <p className="text-sm text-gray-600">
                    {selectedStudent.course} • {selectedStudent.year_level}
                  </p>

                  <p className="text-sm text-gray-600">{selectedExam.title}</p>

                  <div className="flex gap-6 text-sm text-gray-600 mt-1">
                    <span>Status: {selectedStudent.status}</span>
                    <span>
                      Score: {selectedStudent.score ?? 0} /
                      {selectedStudent.max_score ?? 0}
                    </span>
                  </div>
                </div>

                {/* AI THREAT PROBABILITY */}

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

                {/* AI SESSION VERDICT */}

                <div className="mt-6 border rounded p-4">
                  <h3 className="font-semibold mb-2">AI Session Verdict</h3>

                  <p>
                    Behavioral: {riskProbability > 0.8 ? "CHEATING" : "NORMAL"}
                  </p>
                  <p>Confidence: {(riskProbability * 100).toFixed(2)}%</p>
                </div>

                {/* BEHAVIORAL TIMELINE */}

                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Behavioral Timeline</h3>

                  {behaviorLogs.map((log, idx) => (
                    <div key={idx} className="mb-3 text-sm">
                      <p className="font-medium">
                        Q{log.question_index ?? "-"} — {log.final_label}
                      </p>

                      <p className="text-xs text-gray-500">
                        Confidence: {(log.avg_probability * 100).toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>

                {/* RUNTIME SECURITY LOGS */}

                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Runtime Security Logs</h3>

                  {runtimeLogs.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No runtime violations detected.
                    </p>
                  )}

                  {runtimeLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border rounded p-3 mb-2 flex justify-between text-sm"
                    >
                      <div>
                        <p className="font-medium">{log.event_type}</p>
                        <span className="text-xs text-gray-500">
                          Severity: {log.severity}
                        </span>
                      </div>

                      <span className="text-gray-400">
                        {new Date(log.detected_at).toLocaleTimeString()}
                      </span>
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
