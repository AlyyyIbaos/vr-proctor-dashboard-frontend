import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import StudentLayout from "../components/layout/StudentLayout";
import api from "../api";

export default function StudentReportPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("exam_token");

  const params = new URLSearchParams(window.location.search);
  const activeTab = params.get("tab") || "academic";

  const [session, setSession] = useState(null);
  const [behavior, setBehavior] = useState([]);
  const [runtimeLogs, setRuntimeLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await api.get(`/sessions/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSession(sessionRes.data);

        const behaviorRes = await api.get(
          `/aggregation/${sessionId}/behavioral-report`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setBehavior(behaviorRes.data);

        const runtimeRes = await api.get(`/detection/session/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRuntimeLogs(runtimeRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [sessionId, token]);

  if (!session) {
    return (
      <StudentLayout>
        <div className="p-6">Loading report...</div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <button
          onClick={() => navigate("/student")}
          className="text-sm text-pup-maroon hover:underline"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-2xl font-bold">Examination Monitoring Report</h2>

        {/* TABS */}
        <div className="flex gap-6 border-b">
          <a href="?tab=academic">Academic Summary</a>
          <a href="?tab=behavior">Behavioral Monitoring</a>
          <a href="?tab=runtime">Runtime Security</a>
        </div>

        {activeTab === "academic" && (
          <div className="bg-white p-6 rounded shadow space-y-4">
            <p>
              <strong>Session ID:</strong> {session.id}
            </p>
            <p>
              <strong>Exam:</strong> {session.exam_title}
            </p>
            <p>
              <strong>Score:</strong> {session.score} / {session.max_score}
            </p>
            <p>
              <strong>Status:</strong> {session.status}
            </p>
            <p>
              <strong>Final Label:</strong> {session.final_label}
            </p>
          </div>
        )}

        {activeTab === "behavior" && (
          <div className="bg-white p-6 rounded shadow space-y-4">
            {behavior.map((q) => (
              <div key={q.question_index}>
                Q{q.question_index} → {q.final_label}
              </div>
            ))}
          </div>
        )}

        {activeTab === "runtime" && (
          <div className="bg-white p-6 rounded shadow">
            {runtimeLogs.length === 0
              ? "No runtime violations."
              : runtimeLogs.map((r) => (
                  <div key={r.id}>
                    {r.event_type} ({r.severity})
                  </div>
                ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
