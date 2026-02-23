import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function StudentDashboardPage() {
  const navigate = useNavigate();

  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("exam_token");

        if (!token) {
          navigate("/");
          return;
        }

        const response = await api.get("/sessions/active");
        setActiveSessions(response.data);
      } catch (err) {
        console.error("STUDENT DASHBOARD ERROR:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("exam_token");
          localStorage.removeItem("user_role");
          localStorage.removeItem("full_name");
          navigate("/");
        } else {
          setError("Failed to fetch sessions");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("exam_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("full_name");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-pup-maroon">
          SynapSee Student Portal
        </h1>

        <button
          onClick={handleLogout}
          className="text-sm bg-pup-maroon text-white px-4 py-2 rounded hover:bg-pup-goldDark transition"
        >
          Logout
        </button>
      </div>

      {/* Loading */}
      {loading && <div className="text-gray-600">Loading your sessions...</div>}

      {/* Error */}
      {error && <div className="text-red-600 font-medium">{error}</div>}

      {/* Active Sessions */}
      {!loading && !error && (
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-pup-maroon">
            Active Sessions
          </h2>

          {activeSessions.length === 0 ? (
            <p className="text-gray-600">No active sessions found.</p>
          ) : (
            <ul className="space-y-3">
              {activeSessions.map((session) => (
                <li
                  key={session.id}
                  className="border rounded p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {session.exams?.title || "Exam"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {session.status}
                    </p>
                    <p className="text-sm text-gray-500">
                      Risk Level: {session.risk_level}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/student/session/${session.id}`)}
                    className="bg-pup-maroon text-white px-4 py-2 rounded hover:bg-pup-goldDark transition"
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
