import { useEffect, useState } from "react";
import StudentLayout from "../components/layout/StudentLayout";
import api from "../api";
import socket from "../services/socket";
import ProctorExamBuilderPage from "../pages/ProctorExamBuilderPage";

export default function ProctorDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [runtimeLogs, setRuntimeLogs] = useState([]);
  const [behaviorLogs, setBehaviorLogs] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [riskProbability, setRiskProbability] = useState(0);

  /* ==============================
     NEW: FINAL SESSION DATA
  ============================== */

  const [finalVerdict, setFinalVerdict] = useState(null);
  const [finalScore, setFinalScore] = useState(null);

  /* ==================================================
     FETCH LIVE EXAMS
  ================================================== */

  const fetchExams = async () => {
    try {
      const res = await api.get("/exams/live");
      setExams(res.data || []);
    } catch (err) {
      console.error("Failed to fetch live exams:", err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (activeTab === "overview") {
      fetchExams();
    }
  }, [activeTab]);

  /* ==================================================
     AUTO UPDATE WHEN NEW SESSION STARTS
  ================================================== */

  useEffect(() => {
    socket.on("new_session_started", () => {
      console.log("New VR session detected");
      fetchExams();
    });

    return () => {
      socket.off("new_session_started");
    };
  }, []);

  /* ==================================================
     FETCH RUNTIME SECURITY LOGS
  ================================================== */

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

  /* ==================================================
     FETCH BEHAVIORAL TIMELINE
  ================================================== */

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

  /* ==================================================
     REALTIME MONITORING
  ================================================== */

  useEffect(() => {
    if (!selectedStudent) return;

    const sessionId = selectedStudent.id;

    socket.on("connect", () => {
      socket.emit("join_session", sessionId);
    });

    const mapLabel = (severity) => {
      if (severity === "low") return "normal";
      if (severity === "medium") return "suspicious";
      if (severity === "high") return "suspicious";
      return severity;
    };

    const handleAlert = (alert) => {
      if (alert.session_id !== sessionId) return;

      const timestamp = new Date(alert.detected_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const message =
        alert.event_type === "behavioral"
          ? `Behavioral detection (Q${alert.question_index})`
          : alert.event_type;

      setActivityFeed((prev) => [
        {
          time: timestamp,
          message,
        },
        ...prev,
      ]);

      if (alert.event_type === "behavioral") {
        setBehaviorLogs((prev) => [
          {
            question_index: alert.question_index,
            final_label: mapLabel(alert.severity),
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

    /* =====================================
       NEW: FINAL SESSION VERDICT LISTENER
    ===================================== */

    const handleSessionFinalized = (data) => {
      if (data.session_id !== sessionId) return;

      setRiskProbability(data.overall_probability);
      setFinalVerdict(data.final_verdict);
      setFinalScore(`${data.score}/${data.max_score}`);

      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setActivityFeed((prev) => [
        {
          time: timestamp,
          message: `Session finalized → ${data.final_verdict.toUpperCase()} (Score ${data.score}/${data.max_score})`,
        },
        ...prev,
      ]);
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

  const verdictLabel = () => {
    if (riskProbability > 0.8) return "CHEATING";
    if (riskProbability > 0.5) return "SUSPICIOUS";
    return "NORMAL";
  };

  const totalSessions = exams.reduce(
    (acc, exam) => acc + (exam.sessions?.length || 0),
    0,
  );

  const flaggedSessions = exams.reduce((acc, exam) => {
    const flagged =
      exam.sessions?.filter((s) => s.status === "flagged").length || 0;
    return acc + flagged;
  }, 0);

  /* ======================================
     TEMP USAGE TO PREVENT ESLINT ERRORS
  ====================================== */

  void selectedExam;
  void runtimeLogs;
  void behaviorLogs;
  void activityFeed;
  void finalVerdict;
  void finalScore;
  void riskColor;
  void verdictLabel;
  void totalSessions;
  void flaggedSessions;

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* NAVIGATION TABS */}

        <div className="flex space-x-8 border-b pb-3">
          {["overview", "sessions", "exam-builder"].map((tab) => (
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

        {/* TAB CONTENT */}

        {activeTab === "exam-builder" && <ProctorExamBuilderPage />}
      </div>
    </StudentLayout>
  );
}
