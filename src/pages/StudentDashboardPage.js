import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import StudentLayout from "../components/layout/StudentLayout";
import api from "../api";

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("full_name") || "Student";

  const [activeTab, setActiveTab] = useState("upcoming");
  const [liveExam, setLiveExam] = useState(null);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generatedSessionId, setGeneratedSessionId] = useState(null);

  // ============================================
  // FETCH DASHBOARD DATA
  // ============================================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1️⃣ FETCH LIVE EXAM (from exams table)
        const examRes = await api.get("/exams/live");
        const liveExams = examRes.data;

        if (liveExams && liveExams.length > 0) {
          setLiveExam(liveExams[0]); // assume single live exam
        } else {
          setLiveExam(null);
        }

        // 2️⃣ FETCH SESSION HISTORY (from sessions table)
        const historyRes = await api.get("/sessions/history");
        const history = historyRes.data || [];

        const finished = history.filter(
          (session) =>
            session.status === "completed" || session.status === "flagged",
        );

        setCompletedSessions(finished);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ============================================
  // START EXAM → CREATE SESSION
  // ============================================
  const handleStartExam = async () => {
    try {
      const res = await api.post("/sessions/start");

      setGeneratedSessionId(res.data.id);
    } catch (err) {
      console.error("Start exam error:", err);
      alert("Unable to start exam. Ensure a LIVE exam exists.");
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-10">
        {/* ============================= */}
        {/* HEADER */}
        {/* ============================= */}
        <div>
          <h2 className="text-3xl font-bold text-pup-maroon">
            Welcome, {fullName}
          </h2>
          <p className="text-gray-600 mt-2">
            Manage your examinations and monitoring reports.
          </p>
        </div>

        {/* ============================= */}
        {/* LOADING / ERROR */}
        {/* ============================= */}
        {loading && <p className="text-gray-500">Loading dashboard...</p>}

        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            {/* ============================= */}
            {/* TAB NAVIGATION */}
            {/* ============================= */}
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

            {/* ============================= */}
            {/* UPCOMING TAB */}
            {/* ============================= */}
            {activeTab === "upcoming" && (
              <>
                {liveExam ? (
                  <div className="bg-white border rounded-lg p-6 flex justify-between items-center shadow-sm">
                    <div>
                      <h4 className="text-lg font-semibold">
                        {liveExam.title}
                      </h4>
                      <p className="text-sm text-gray-500">Status: LIVE</p>
                    </div>

                    <button
                      onClick={handleStartExam}
                      className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
                    >
                      Start Exam
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No live exam available at the moment.
                  </p>
                )}

                {/* SESSION GENERATED MESSAGE */}
                {generatedSessionId && (
                  <div className="mt-6 bg-green-50 border border-green-400 p-5 rounded">
                    <p className="font-semibold text-green-700">
                      Exam Session ID generated. You may start the exam.
                    </p>

                    <p className="mt-3 text-sm text-gray-700">Session ID:</p>

                    <p className="font-mono text-lg mt-1">
                      {generatedSessionId}
                    </p>

                    <p className="text-xs text-gray-500 mt-3">
                      Please manually enter this Session ID into the VR device
                      before beginning the examination.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ============================= */}
            {/* COMPLETED TAB */}
            {/* ============================= */}
            {activeTab === "completed" && (
              <div className="space-y-4">
                {completedSessions.length === 0 && (
                  <p className="text-gray-500">No completed exams yet.</p>
                )}

                {completedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white border rounded-lg p-6 flex justify-between items-center shadow-sm"
                  >
                    <div>
                      <h4 className="text-lg font-semibold">
                        {session.exam_title}
                      </h4>

                      <p className="text-sm text-gray-500">
                        Score: {session.score ?? 0} / {session.max_score ?? 0}
                      </p>

                      <p className="text-sm text-gray-500">
                        Status: {session.status}
                      </p>

                      <p className="text-sm text-gray-500">
                        Final Label: {session.final_label ?? "Pending"}
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
          </>
        )}
      </div>
    </StudentLayout>
  );
}
