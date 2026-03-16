import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import StudentLayout from "../components/layout/StudentLayout";
import api from "../api";

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("full_name") || "Student";

  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState(null);

  /* ================================
     LIVE EXAMS STATE
  ================================= */

  const [exams, setExams] = useState([]);

  /* ================================
     COMPLETED EXAMS (UNCHANGED)
  ================================= */

  const completedExams = [
    {
      id: "d4868390-a11c-4a78-b833-27fd2c606c06",
      exam_name: "Pre-Test",
      score: 3,
      max_score: 5,
      status: "Completed",
    },
  ];

  /*
  ==============================================
  LOAD ACTIVE SESSION ON PAGE LOAD
  ==============================================
  */

  useEffect(() => {
    const loadActiveSession = async () => {
      try {
        console.log("Checking for active VR session...");

        const res = await api.get("/sessions/active");

        console.log("ACTIVE SESSION RESPONSE:", res.data);

        if (res.data && res.data.length > 0) {
          const session = res.data[0];

          setSessionData({
            sessionId: session.id,
            sessionCode: session.session_code,
            examTitle: session.exams?.title || "VR Examination",
          });
        }
      } catch (err) {
        console.error("LOAD ACTIVE SESSION ERROR:", err);
      }
    };

    loadActiveSession();
  }, []);

  /*
  ==============================================
  LOAD LIVE EXAMS FROM BACKEND
  ==============================================
  */

  useEffect(() => {
    const loadExams = async () => {
      try {
        const res = await api.get("/exams/live");
        console.log("LIVE EXAMS:", res.data);
        setExams(res.data || []);
      } catch (err) {
        console.error("Failed to load exams:", err);
      }
    };

    loadExams();
  }, []);

  /*
  ==============================================
  START EXAM SESSION
  ==============================================
  */

  const handleStartExam = async (examId) => {
    try {
      console.log("Start Exam button clicked:", examId);

      setLoading(true);

      const res = await api.post("/sessions/start", {
        exam_id: examId,
      });

      console.log("SESSION START RESPONSE:", res.data);

      const session = res.data;

      setSessionData({
        sessionId: session.id,
        sessionCode: session.session_code,
        examTitle: session.exams?.title || "VR Examination",
      });

      if (session.message) {
        alert(
          "You already have an active VR exam session. Use the same Session Code in the VR headset.",
        );
      } else {
        alert(
          "VR exam session created. Enter the Session Code inside the VR headset.",
        );
      }
    } catch (err) {
      console.error("START SESSION ERROR:", err);
      alert(err.response?.data?.error || "Failed to create exam session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-10">
        <div>
          <h2 className="text-3xl font-bold text-pup-maroon">
            Welcome, {fullName}
          </h2>

          <p className="text-gray-600 mt-2">
            Manage your examinations and monitoring reports.
          </p>
        </div>

        {/* TABS */}

        <div className="flex gap-8 border-b text-lg font-semibold">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-2 ${
              activeTab === "upcoming"
                ? "border-b-2 border-pup-maroon text-pup-maroon"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Upcoming
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-2 ${
              activeTab === "completed"
                ? "border-b-2 border-pup-maroon text-pup-maroon"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Completed
          </button>
        </div>

        {/* UPCOMING EXAMS */}

        {activeTab === "upcoming" && (
          <div className="space-y-4">
            {exams.length === 0 && (
              <p className="text-gray-500">No available exams.</p>
            )}

            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white border rounded-lg p-6 flex justify-between items-center shadow-sm"
              >
                <div>
                  <h4 className="text-lg font-semibold">{exam.title}</h4>

                  <p className="text-sm text-gray-500">
                    Subject: {exam.subject}
                  </p>

                  <p className="text-sm text-gray-500">
                    Duration: {exam.duration_minutes} minutes
                  </p>
                </div>

                <button
                  onClick={() => handleStartExam(exam.id)}
                  disabled={loading}
                  className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? "Initializing..." : "Start Exam"}
                </button>
              </div>
            ))}

            {/* SESSION CODE DISPLAY */}

            {sessionData && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-5">
                <h3 className="font-semibold text-yellow-800">
                  VR Exam Session Ready
                </h3>

                <p className="text-sm mt-2">
                  Enter this Session Code inside the VR headset to begin the
                  exam.
                </p>

                <div className="mt-3 text-2xl font-mono bg-white border rounded p-3 text-center">
                  {sessionData.sessionCode}
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Exam: {sessionData.examTitle}
                </p>
              </div>
            )}
          </div>
        )}

        {/* COMPLETED EXAMS (UNCHANGED) */}

        {activeTab === "completed" && (
          <div className="space-y-4">
            {completedExams.map((session) => (
              <div
                key={session.id}
                className="bg-white border rounded-lg p-6 flex justify-between items-center shadow-sm"
              >
                <div>
                  <h4 className="text-lg font-semibold">{session.exam_name}</h4>

                  <p className="text-sm text-gray-500">
                    Score: {session.score} / {session.max_score}
                  </p>

                  <p className="text-sm text-gray-500">
                    Status: {session.status}
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(`/student/report/${session.id}?tab=academic`)
                  }
                  className="bg-pup-maroon text-white px-5 py-2 rounded hover:bg-pup-goldDark transition"
                >
                  View Report
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
