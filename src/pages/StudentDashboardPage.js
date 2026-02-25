import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import logo from "../assets/synapsee-logo.png";

export default function StudentDashboardPage() {
  const navigate = useNavigate();

  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fullName = localStorage.getItem("full_name");

  const handleLogout = useCallback(() => {
    localStorage.removeItem("exam_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("full_name");
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("exam_token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const activeRes = await api.get("/sessions/active");
        setActiveSessions(activeRes.data || []);
      } catch (err) {
        console.error("STUDENT DASHBOARD ERROR:", err);

        if (err.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, handleLogout]);

  const handleStartExam = async () => {
    try {
      await api.post("/sessions/start");
      alert("Exam session created. You may now launch the VR device.");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to start exam.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SynapSee Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-pup-maroon">
            SynapSee Student Portal
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-600">{fullName}</span>
          <button
            onClick={handleLogout}
            className="bg-pup-maroon text-white px-4 py-2 rounded hover:bg-pup-goldDark transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-8">
        <h2 className="text-3xl font-bold text-pup-maroon mb-4">
          Your Exam & Monitoring Overview
        </h2>

        <p className="text-gray-600 mb-8">
          SynapSee ensures fair and secure virtual examinations through
          AI-powered behavioral analysis and runtime integrity monitoring.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold mb-2">Academic Summary</h3>
            <p>
              Status:{" "}
              {activeSessions.length > 0
                ? "Active Session"
                : "No Active Session"}
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold mb-2">Behavioral Monitoring</h3>
            <p>
              Risk Level:{" "}
              {activeSessions.length > 0 ? activeSessions[0].risk_level : "low"}
            </p>
            <p className="text-sm text-gray-500">
              Based on CNN–LSTM + CAT aggregation
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold mb-2">Runtime Security</h3>
            <p>Integrity Monitoring Active</p>
          </div>
        </div>

        {activeSessions.length === 0 && (
          <button
            onClick={handleStartExam}
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Start Live Exam
          </button>
        )}

        {activeSessions.length === 0 ? (
          <p>No active sessions found.</p>
        ) : (
          activeSessions.map((session) => (
            <div
              key={session.id}
              className="border p-4 rounded mb-4 flex justify-between items-center bg-white"
            >
              <div>
                <p className="font-semibold">{session.exams?.title}</p>
                <p>Status: {session.status}</p>
                <p>Risk Level: {session.risk_level}</p>
              </div>

              <button
                onClick={() => navigate(`/student/session/${session.id}`)}
                className="bg-pup-maroon text-white px-4 py-2 rounded hover:bg-pup-goldDark transition"
              >
                View
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
