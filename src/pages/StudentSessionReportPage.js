import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import logo from "../assets/synapsee-logo.png";

export default function StudentSessionReportPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [behaviorReport, setBehaviorReport] = useState([]);
  const [runtimeLogs, setRuntimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("exam_token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const sessionRes = await api.get(`/sessions/${sessionId}`);
        const behaviorRes = await api.get(
          `/sessions/${sessionId}/behavioral-report`,
        );
        const runtimeRes = await api.get(`/detections/session/${sessionId}`);

        setSession(sessionRes.data);
        setBehaviorReport(behaviorRes.data || []);
        setRuntimeLogs(runtimeRes.data || []);
      } catch (err) {
        console.error("SESSION REPORT ERROR:", err);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // =========================
  // BEHAVIOR AGGREGATION
  // =========================
  const flaggedCount = behaviorReport.filter(
    (q) => q.final_label === "cheating",
  ).length;

  const overallBehavior = flaggedCount >= 3 ? "CHEATING" : "NORMAL";

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

      <div className="p-8 space-y-10">
        {/* ========================= */}
        {/* 1️⃣ ACADEMIC SUMMARY */}
        {/* ========================= */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            Academic / Exam Summary
          </h2>

          <p>
            <strong>Exam:</strong> {session.exam_title}
          </p>
          <p>
            <strong>Status:</strong> {session.status}
          </p>
          <p>
            <strong>Score:</strong> {session.score ?? 0} /{" "}
            {session.max_score ?? 0}
          </p>
          <p>
            <strong>Final Label:</strong> {session.final_label || "Pending"}
          </p>
        </div>

        {/* ========================= */}
        {/* 2️⃣ MONITORED BEHAVIOR */}
        {/* ========================= */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            Monitored Behavior (AI Aggregation)
          </h2>

          {behaviorReport.length === 0 ? (
            <p>No behavioral data recorded.</p>
          ) : (
            <>
              <table className="w-full border mb-6">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Question No.</th>
                    <th className="p-2 border">Behavior</th>
                  </tr>
                </thead>
                <tbody>
                  {behaviorReport.map((q) => (
                    <tr key={q.question_index}>
                      <td className="p-2 border text-center">
                        Q{q.question_index}
                      </td>
                      <td className="p-2 border text-center">
                        {q.final_label === "cheating" ? "Suspicious" : "Normal"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-lg font-semibold">
                Overall Behavior:{" "}
                <span
                  className={
                    overallBehavior === "CHEATING"
                      ? "text-red-600"
                      : "text-green-600"
                  }
                >
                  {overallBehavior}
                </span>
              </div>
            </>
          )}
        </div>

        {/* ========================= */}
        {/* 3️⃣ RUNTIME SECURITY */}
        {/* ========================= */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            Monitored Runtime Security
          </h2>

          {runtimeLogs.length === 0 ? (
            <p>No runtime security violations detected.</p>
          ) : (
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Detected At</th>
                </tr>
              </thead>
              <tbody>
                {runtimeLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="p-2 border text-center">{log.event_type}</td>
                    <td className="p-2 border text-center">
                      {new Date(log.detected_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
