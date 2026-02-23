import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import logo from "../assets/synapsee-logo.png";

export default function StudentSessionReportPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("exam_token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchReport = async () => {
      try {
        const sessionRes = await api.get(`/sessions/${sessionId}`);
        const reportRes = await api.get(
          `/sessions/${sessionId}/behavioral-report`,
        );

        setSession(sessionRes.data);
        setReport(reportRes.data);
      } catch (err) {
        console.error("REPORT ERROR:", err);

        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading session report...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Session not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SynapSee Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-pup-maroon">Session Report</h1>
        </div>

        <button
          onClick={() => navigate("/student")}
          className="bg-pup-maroon text-white px-4 py-2 rounded hover:bg-pup-goldDark transition"
        >
          Back
        </button>
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">{session.exams?.title}</h2>

        {report.length === 0 ? (
          <p>No behavioral data available.</p>
        ) : (
          report.map((q) => (
            <div
              key={q.question_index}
              className="bg-white p-6 rounded shadow mb-6"
            >
              <h3 className="font-semibold mb-2">
                Question {q.question_index}
              </h3>

              <p>Total Windows: {q.total_windows}</p>
              <p>Flagged Windows: {q.flagged_windows}</p>
              <p>Avg Probability: {q.avg_probability.toFixed(4)}</p>
              <p>
                Final Label:{" "}
                <span className="font-semibold">{q.final_label}</span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
