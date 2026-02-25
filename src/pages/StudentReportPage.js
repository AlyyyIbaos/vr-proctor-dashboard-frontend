import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import StudentLayout from "../components/layout/StudentLayout";
import api from "../api";

export default function StudentReportPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const activeTab = params.get("tab") || "academic";

  const [academicData, setAcademicData] = useState(null);
  const [behaviorData, setBehaviorData] = useState([]);
  const [runtimeData, setRuntimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // FETCH ACADEMIC SUMMARY (sessions table)
  // ============================================
  useEffect(() => {
    const fetchAcademic = async () => {
      try {
        const res = await api.get(`/sessions/${sessionId}`);
        setAcademicData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load session details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAcademic();
  }, [sessionId]);

  // ============================================
  // FETCH BEHAVIOR REPORT (inference_logs)
  // ============================================
  useEffect(() => {
    if (activeTab !== "behavior") return;

    const fetchBehavior = async () => {
      try {
        const res = await api.get(
          `/aggregation/${sessionId}/behavioral-report`,
        );
        setBehaviorData(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBehavior();
  }, [activeTab, sessionId]);

  // ============================================
  // FETCH RUNTIME SECURITY (cheating_logs)
  // ============================================
  useEffect(() => {
    if (activeTab !== "runtime") return;

    const fetchRuntime = async () => {
      try {
        const res = await api.get(`/detection/session/${sessionId}`);
        setRuntimeData(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRuntime();
  }, [activeTab, sessionId]);

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

        {/* TAB NAVIGATION */}
        <div className="flex gap-6 border-b">
          <a
            href={`?tab=academic`}
            className={`pb-2 ${
              activeTab === "academic"
                ? "border-b-2 border-pup-maroon text-pup-maroon"
                : ""
            }`}
          >
            Academic Summary
          </a>

          <a
            href={`?tab=behavior`}
            className={`pb-2 ${
              activeTab === "behavior"
                ? "border-b-2 border-pup-maroon text-pup-maroon"
                : ""
            }`}
          >
            Monitored Behavior
          </a>

          <a
            href={`?tab=runtime`}
            className={`pb-2 ${
              activeTab === "runtime"
                ? "border-b-2 border-pup-maroon text-pup-maroon"
                : ""
            }`}
          >
            Monitored Runtime Security
          </a>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* ============================ */}
        {/* ACADEMIC SUMMARY */}
        {/* ============================ */}
        {activeTab === "academic" && academicData && (
          <div className="bg-white p-6 rounded shadow space-y-4">
            <p>
              <strong>Exam Name:</strong> {academicData.exam_title}
            </p>
            <p>
              <strong>Score:</strong> {academicData.score ?? 0} /{" "}
              {academicData.max_score ?? 0}
            </p>
            <p>
              <strong>Status:</strong> {academicData.status}
            </p>
            <p>
              <strong>Final Behavior Label:</strong>{" "}
              {academicData.final_label ?? "Pending"}
            </p>
            <p>
              <strong>Confidence:</strong> {academicData.final_confidence ?? 0}
            </p>
          </div>
        )}

        {/* ============================ */}
        {/* BEHAVIOR MONITORING */}
        {/* ============================ */}
        {activeTab === "behavior" && (
          <div className="bg-white p-6 rounded shadow space-y-4">
            {behaviorData.length === 0 ? (
              <p>No behavioral anomalies detected.</p>
            ) : (
              <>
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Question</th>
                      <th className="p-2 border">Flagged Windows</th>
                      <th className="p-2 border">Avg Probability</th>
                      <th className="p-2 border">Final Label</th>
                    </tr>
                  </thead>
                  <tbody>
                    {behaviorData.map((q) => (
                      <tr key={q.question_index}>
                        <td className="p-2 border text-center">
                          Q{q.question_index}
                        </td>
                        <td className="p-2 border text-center">
                          {q.flagged_windows}
                        </td>
                        <td className="p-2 border text-center">
                          {q.avg_probability?.toFixed(3)}
                        </td>
                        <td className="p-2 border text-center">
                          {q.final_label}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}

        {/* ============================ */}
        {/* RUNTIME SECURITY */}
        {/* ============================ */}
        {activeTab === "runtime" && (
          <div className="bg-white p-6 rounded shadow">
            {runtimeData.length === 0 ? (
              <p>No integrity violations detected.</p>
            ) : (
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Severity</th>
                    <th className="p-2 border">Confidence</th>
                    <th className="p-2 border">Detected At</th>
                  </tr>
                </thead>
                <tbody>
                  {runtimeData.map((log) => (
                    <tr key={log.id}>
                      <td className="p-2 border">{log.event_type}</td>
                      <td className="p-2 border text-center">{log.severity}</td>
                      <td className="p-2 border text-center">
                        {log.confidence_level}
                      </td>
                      <td className="p-2 border text-center">
                        {new Date(log.detected_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
