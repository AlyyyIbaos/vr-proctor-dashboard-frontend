import { useParams, useNavigate } from "react-router-dom";
import StudentLayout from "../components/layout/StudentLayout.js";

export default function StudentReportPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const activeTab = params.get("tab") || "academic";

  // MOCK BEHAVIOR DATA (Q1–Q10)
  const behaviorData = [
    { q: 1, label: "suspicious" },
    { q: 2, label: "normal" },
    { q: 3, label: "normal" },
    { q: 4, label: "suspicious" },
    { q: 5, label: "normal" },
    { q: 6, label: "normal" },
    { q: 7, label: "normal" },
    { q: 8, label: "normal" },
    { q: 9, label: "normal" },
    { q: 10, label: "suspicious" },
  ];

  const suspiciousCount = behaviorData.filter(
    (b) => b.label === "suspicious",
  ).length;

  const overallBehavior = suspiciousCount >= 3 ? "Normal" : "Cheating";

  const runtimeViolations = [
    { type: "Object Whitelisting Violation", question: 4 },
    { type: "Scene Tampering", question: 10 },
  ];

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
            Behavioral Monitoring
          </a>

          <a
            href={`?tab=runtime`}
            className={`pb-2 ${
              activeTab === "runtime"
                ? "border-b-2 border-pup-maroon text-pup-maroon"
                : ""
            }`}
          >
            Runtime Security Monitoring
          </a>
        </div>

        {/* TAB CONTENT */}
        {activeTab === "academic" && (
          <div className="bg-white p-6 rounded shadow space-y-4">
            <p>
              <strong>Session ID:</strong> {sessionId}
            </p>
            <p>
              <strong>Exam Name:</strong> Computer Networks Final
            </p>
            <p>
              <strong>Score:</strong> 42 / 50
            </p>
            <p>
              <strong>Status:</strong> Completed
            </p>
          </div>
        )}

        {activeTab === "behavior" && (
          <div className="bg-white p-6 rounded shadow space-y-4">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Question</th>
                  <th className="p-2 border">Behavior</th>
                </tr>
              </thead>
              <tbody>
                {behaviorData.map((b) => (
                  <tr key={b.q}>
                    <td className="p-2 border text-center">Q{b.q}</td>
                    <td
                      className={`p-2 border text-center ${
                        b.label === "suspicious"
                          ? "text-red-600 font-semibold"
                          : "text-green-600"
                      }`}
                    >
                      {b.label}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p>
              <strong>Total Suspicious:</strong> {suspiciousCount}
            </p>

            <p>
              <strong>Overall Behavior:</strong>{" "}
              <span className="font-semibold">{overallBehavior}</span>
            </p>
          </div>
        )}

        {activeTab === "runtime" && (
          <div className="bg-white p-6 rounded shadow">
            {runtimeViolations.length === 0 ? (
              <p>No integrity violations detected.</p>
            ) : (
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Question</th>
                  </tr>
                </thead>
                <tbody>
                  {runtimeViolations.map((r, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{r.type}</td>
                      <td className="p-2 border text-center">Q{r.question}</td>
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
