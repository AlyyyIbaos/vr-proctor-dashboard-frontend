import React from "react";
import logo from "../assets/synapsee-logo.png";

export default function StudentDashboardPage() {
  const fullName = "Alyssa";

  const [selectedExam, setSelectedExam] = useState(null);
  const [activeTab, setActiveTab] = useState("academic");

  // ===============================
  // MOCK EXAMS LIST
  // ===============================
  const exams = [
    {
      id: 1,
      title: "Artificial Intelligence Midterm",
      score: 18,
      max_score: 20,
      final_label: "cheating",
    },
    {
      id: 2,
      title: "Machine Learning Quiz 1",
      score: 9,
      max_score: 10,
      final_label: "normal",
    },
  ];

  // ===============================
  // MOCK REPORT DATA
  // ===============================
  const mockReport = {
    behavior_summary: [
      { question: 1, label: "suspicious" },
      { question: 2, label: "normal" },
      { question: 3, label: "normal" },
      { question: 4, label: "suspicious" },
      { question: 5, label: "normal" },
      { question: 6, label: "normal" },
      { question: 7, label: "suspicious" },
      { question: 8, label: "normal" },
      { question: 9, label: "normal" },
      { question: 10, label: "suspicious" },
    ],
    runtime_flags: [
      { type: "Scene Tampering", question: 4 },
      { type: "Object Whitelisting Violation", question: 7 },
    ],
  };

  const suspiciousCount = mockReport.behavior_summary.filter(
    (q) => q.label === "suspicious",
  ).length;

  const handleLogout = () => {
    alert("Logout clicked (mock)");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= HEADER ================= */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SynapSee Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-pup-maroon">
            SynapSee Student Portal
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span>{fullName}</span>
          <button
            onClick={handleLogout}
            className="bg-pup-maroon text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* ================= EXAM LIST ================= */}
        {!selectedExam && (
          <>
            <h2 className="text-2xl font-bold mb-6">Exams Taken</h2>

            <div className="space-y-4">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white p-6 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{exam.title}</h3>
                    <p>
                      Score: {exam.score} / {exam.max_score}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedExam(exam)}
                    className="bg-pup-maroon text-white px-4 py-2 rounded"
                  >
                    View Report
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= REPORT VIEW ================= */}
        {selectedExam && (
          <>
            <button
              onClick={() => setSelectedExam(null)}
              className="mb-4 text-pup-maroon underline"
            >
              ← Back to Exams
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {selectedExam.title} - Monitoring Report
            </h2>

            {/* ================= TABS ================= */}
            <div className="flex gap-6 border-b mb-6">
              <button
                onClick={() => setActiveTab("academic")}
                className={`pb-2 ${
                  activeTab === "academic"
                    ? "border-b-2 border-pup-maroon font-semibold"
                    : ""
                }`}
              >
                Academic Summary
              </button>

              <button
                onClick={() => setActiveTab("behavior")}
                className={`pb-2 ${
                  activeTab === "behavior"
                    ? "border-b-2 border-pup-maroon font-semibold"
                    : ""
                }`}
              >
                Monitored Behavior
              </button>

              <button
                onClick={() => setActiveTab("runtime")}
                className={`pb-2 ${
                  activeTab === "runtime"
                    ? "border-b-2 border-pup-maroon font-semibold"
                    : ""
                }`}
              >
                Runtime Security
              </button>
            </div>

            {/* ================= TAB CONTENT ================= */}
            <div className="bg-white p-6 rounded shadow">
              {/* Academic */}
              {activeTab === "academic" && (
                <>
                  <p>
                    <strong>Score:</strong> {selectedExam.score} /{" "}
                    {selectedExam.max_score}
                  </p>
                  <p>
                    <strong>Final Behavior Label:</strong>{" "}
                    {selectedExam.final_label === "cheating" ? (
                      <span className="text-red-600 font-bold">Cheating</span>
                    ) : (
                      <span className="text-green-600 font-bold">Normal</span>
                    )}
                  </p>
                </>
              )}

              {/* Behavior */}
              {activeTab === "behavior" && (
                <>
                  <table className="w-full border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2">Question</th>
                        <th className="border p-2">Behavior</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockReport.behavior_summary.map((item, index) => (
                        <tr key={index}>
                          <td className="border p-2">Q{item.question}</td>
                          <td
                            className={`border p-2 ${
                              item.label === "suspicious"
                                ? "text-red-600 font-semibold"
                                : "text-green-600"
                            }`}
                          >
                            {item.label}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-4">
                    Total Suspicious Flags: {suspiciousCount}
                  </div>
                </>
              )}

              {/* Runtime */}
              {activeTab === "runtime" && (
                <>
                  {mockReport.runtime_flags.length === 0 ? (
                    <p>No integrity violations detected.</p>
                  ) : (
                    <table className="w-full border">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2">Type</th>
                          <th className="border p-2">Question</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockReport.runtime_flags.map((flag, index) => (
                          <tr key={index}>
                            <td className="border p-2">{flag.type}</td>
                            <td className="border p-2">Q{flag.question}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
