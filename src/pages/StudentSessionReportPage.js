import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentLayout from "../components/layout/StudentLayout";
import { Card, CardContent } from "../components/ui/card";

export default function StudentSessionReportPage() {
  const { sessionId } = useParams();

  const [session, setSession] = useState(null);
  const [behavioral, setBehavioral] = useState([]);
  const [runtimeLogs, setRuntimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/sessions/${sessionId}`,
        );
        const sessionData = await sessionRes.json();
        setSession(sessionData);

        const behavioralRes = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/sessions/${sessionId}/behavioral-report`,
        );
        const behavioralData = await behavioralRes.json();
        setBehavioral(behavioralData);

        setRuntimeLogs(sessionData.alerts || []);
      } catch (err) {
        console.error("REPORT FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  if (loading) {
    return (
      <StudentLayout>
        <p className="text-gray-500">Loading AI audit report...</p>
      </StudentLayout>
    );
  }

  if (!session) {
    return (
      <StudentLayout>
        <p className="text-red-500">Session not found.</p>
      </StudentLayout>
    );
  }

  const totalQuestions = behavioral.length;
  const cheatingQuestions = behavioral.filter(
    (q) => q.final_label === "cheating",
  ).length;

  return (
    <StudentLayout>
      {/* ================= EXECUTIVE SUMMARY ================= */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-pup-maroon mb-2">
          AI Behavioral & Security Audit Report
        </h1>

        <p className="text-gray-600">Exam: {session.exam_title}</p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6 grid md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Session Status</p>
            <p className="font-semibold">{session.status}</p>
          </div>

          <div>
            <p className="text-gray-500">Final Verdict</p>
            <p className="font-semibold text-pup-maroon">
              {session.final_label || "Pending"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Score</p>
            <p className="font-semibold">
              {session.score}/{session.max_score}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Behavioral Flags</p>
            <p className="font-semibold">
              {cheatingQuestions}/{totalQuestions} Questions Flagged
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ================= AGGREGATION EXPLANATION ================= */}
      <Card className="mb-10">
        <CardContent className="p-6 text-sm text-gray-700">
          <p className="font-semibold mb-2">Behavioral Aggregation Rule</p>
          <p>
            Each question is divided into multiple inference windows (1 window =
            120 frames ≈ 6 seconds).
          </p>
          <p className="mt-2">
            A question is labeled as <strong>CHEATING</strong> if three (3) or
            more windows are flagged anomalous (pred_raw = 1 or cat_active = 1).
            Otherwise, it is labeled <strong>NORMAL</strong>.
          </p>
        </CardContent>
      </Card>

      {/* ================= BEHAVIORAL DETAILS ================= */}
      <h2 className="text-xl font-semibold mb-6">
        Behavioral Monitoring (CNN–LSTM + CAT)
      </h2>

      <div className="space-y-6 mb-12">
        {behavioral.map((q) => {
          const percentage = (q.flagged_windows / q.total_windows) * 100;

          return (
            <Card key={q.question_index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">
                      Question {q.question_index + 1}
                    </p>
                    <p className="text-sm text-gray-500">
                      {q.flagged_windows} / {q.total_windows} flagged windows
                    </p>
                  </div>

                  <div
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      q.final_label === "cheating"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {q.final_label.toUpperCase()}
                  </div>
                </div>

                {/* Visual Risk Bar */}
                <div className="mt-4 bg-gray-200 rounded h-2">
                  <div
                    className={`h-2 rounded ${
                      q.final_label === "cheating"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Average Probability: {q.avg_probability.toFixed(3)} | Decision
                  Mode: {q.decision_mode}
                </p>

                <button
                  onClick={() =>
                    setExpanded(
                      expanded === q.question_index ? null : q.question_index,
                    )
                  }
                  className="text-pup-maroon text-sm mt-4 hover:underline"
                >
                  {expanded === q.question_index
                    ? "Hide Detailed Window Logs"
                    : "View Detailed Window Logs"}
                </button>

                {expanded === q.question_index && (
                  <div className="mt-4 border-t pt-4 space-y-3 text-sm">
                    {q.windows.map((w) => (
                      <div
                        key={w.window_index}
                        className="border rounded p-3 bg-gray-50"
                      >
                        <p className="font-semibold">Window {w.window_index}</p>
                        <p>prob_cheat: {w.prob_cheat.toFixed(4)}</p>
                        <p>pred_raw: {w.pred_raw}</p>
                        <p>cat_active: {w.cat_active}</p>
                        <p>cat_transition: {w.cat_transition}</p>
                        <p>decision_mode: {w.decision_mode}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ================= RUNTIME SECURITY ================= */}
      <h2 className="text-xl font-semibold mb-6">
        Runtime Security Monitoring (Integrity Layer)
      </h2>

      {runtimeLogs.length === 0 ? (
        <p className="text-gray-500">
          No runtime integrity violations detected.
        </p>
      ) : (
        <div className="space-y-4">
          {runtimeLogs.map((log) => (
            <Card key={log.id}>
              <CardContent className="p-4 text-sm">
                <div className="flex justify-between">
                  <p className="font-semibold">{log.event_type}</p>
                  <span
                    className={`px-3 py-1 rounded text-xs ${
                      log.severity === "high"
                        ? "bg-red-100 text-red-700"
                        : log.severity === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {log.severity}
                  </span>
                </div>

                <p className="text-gray-600 mt-2">
                  Confidence: {(log.confidence_level * 100).toFixed(1)}%
                </p>

                <p className="text-gray-500 text-xs mt-1">
                  {new Date(log.detected_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </StudentLayout>
  );
}
