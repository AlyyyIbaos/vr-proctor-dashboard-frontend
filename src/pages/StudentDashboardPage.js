import { useState } from "react";
import logo from "../assets/synapsee-logo.png";

export default function StudentDashboardPage() {
  const fullName = "Alyssa";

  // ===============================
  // MOCK DATA (THESIS DEMO MODE)
  // ===============================
  const mockReport = {
    exam_title: "Artificial Intelligence Midterm Exam",
    score: 18,
    max_score: 20,
    status: "completed",
    final_label: "cheating", // or "normal"

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SynapSee Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-pup-maroon">
            SynapSee Student Portal
          </h1>
        </div>

        <span className="text-gray-600">{fullName}</span>
      </div>

      <div className="p-8 space-y-10">
        <h2 className="text-3xl font-bold text-pup-maroon">
          Exam Monitoring Report
        </h2>

        {/* ============================= */}
        {/* ACADEMIC SUMMARY */}
        {/* ============================= */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Academic Summary</h3>

          <p>
            <strong>Exam:</strong> {mockReport.exam_title}
          </p>
          <p>
            <strong>Score:</strong> {mockReport.score} / {mockReport.max_score}
          </p>
          <p>
            <strong>Status:</strong> {mockReport.status}
          </p>
          <p>
            <strong>Final Behavior Label:</strong>{" "}
            {mockReport.final_label === "cheating" ? (
              <span className="text-red-600 font-bold">Cheating</span>
            ) : (
              <span className="text-green-600 font-bold">Normal</span>
            )}
          </p>
        </div>

        {/* ============================= */}
        {/* MONITORED BEHAVIOR */}
        {/* ============================= */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">
            Monitored Behavior (CNN-LSTM + CAT)
          </h3>

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
            <strong>Total Suspicious Flags:</strong> {suspiciousCount}
          </div>

          <div>
            <strong>Overall Behavior:</strong>{" "}
            {mockReport.final_label === "cheating" ? (
              <span className="text-red-600 font-bold">Cheating</span>
            ) : (
              <span className="text-green-600 font-bold">Normal</span>
            )}
          </div>
        </div>

        {/* ============================= */}
        {/* RUNTIME SECURITY */}
        {/* ============================= */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">
            Monitored Runtime Security
          </h3>

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
        </div>
      </div>
    </div>
  );
}
