import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import StudentLayout from "../components/layout/StudentLayout";
import api from "../api";

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("full_name") || "Student";
  const token = localStorage.getItem("exam_token");

  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingExam, setUpcomingExam] = useState(null);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD STUDENT SESSIONS
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/sessions/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sessions = res.data || [];

        const active = sessions.find((s) => s.status === "active");
        const completed = sessions.filter(
          (s) => s.status === "completed" || s.status === "flagged",
        );

        setUpcomingExam(active || null);
        setCompletedSessions(completed);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // =========================
  // START EXAM (CREATE SESSION)
  // =========================
  const handleStartExam = async () => {
    try {
      const res = await api.post(
        "/sessions/start",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert(
        `Exam Session ID generated.\n\nSession ID:\n${res.data.id}\n\nYou may now start the VR exam.`,
      );

      // Refresh dashboard
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to start exam.");
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="max-w-5xl mx-auto p-6">Loading...</div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="max-w-5xl mx-auto p-6 text-red-600">{error}</div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-10">
        {/* WELCOME */}
        <div>
          <h2 className="text-3xl font-bold text-pup-maroon">
            Welcome, {fullName}
          </h2>
          <p className="text-gray-600 mt-2">
            Manage your examinations and monitoring reports.
          </p>
        </div>

        {/* TAB HEADER */}
        <div className="flex gap-8 border-b text-lg font-semibold">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-2 ${
              activeTab === "upcoming"
                ? "border-b-2 border-pup-maroon text-pup-maroon"
                : "text-gray-500"
            }`}
          >
            Upcoming
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-2 ${
              activeTab === "completed"
                ? "border-b-2 border-pup-maroon text-pup-maroon"
                : "text-gray-500"
            }`}
          >
            Completed
          </button>
        </div>

        {/* UPCOMING */}
        {activeTab === "upcoming" && (
          <>
            {upcomingExam ? (
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold">
                  {upcomingExam.exam_title}
                </h4>
                <p className="text-sm text-gray-500">
                  Status: {upcomingExam.status}
                </p>
              </div>
            ) : (
              <div className="bg-white border rounded-lg p-6 shadow-sm flex justify-between items-center">
                <p>No active session. You may start the live exam.</p>
                <button
                  onClick={handleStartExam}
                  className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
                >
                  Start Exam
                </button>
              </div>
            )}
          </>
        )}

        {/* COMPLETED */}
        {activeTab === "completed" && (
          <div className="space-y-4">
            {completedSessions.length === 0 && <p>No completed exams yet.</p>}

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
