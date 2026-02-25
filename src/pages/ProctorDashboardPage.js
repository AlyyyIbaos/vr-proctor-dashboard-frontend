import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ProctorDashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/sessions");
        setSessions(res.data || []);
      } catch (err) {
        console.error("PROCTOR FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading active sessions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Proctor Live Dashboard</h1>

      {sessions.length === 0 ? (
        <p>No active sessions.</p>
      ) : (
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Exam</th>
              <th className="p-3 text-left">Risk</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="border-t">
                <td className="p-3">{session.examinees?.full_name}</td>
                <td className="p-3">{session.exams?.title}</td>
                <td className="p-3">{session.risk_level}</td>
                <td className="p-3">{session.status}</td>
                <td className="p-3">
                  <button
                    onClick={() => navigate(`/proctor/session/${session.id}`)}
                    className="bg-pup-maroon text-white px-3 py-1 rounded"
                  >
                    Monitor
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
