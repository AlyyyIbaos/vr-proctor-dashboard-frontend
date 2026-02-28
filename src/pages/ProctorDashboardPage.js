import { useMemo, useState } from "react";
import StudentLayout from "../components/layout/StudentLayout";

// ================= MOCK STUDENTS =================
const mockStudents = [
  {
    id: "session-001",
    name: "Alyssa",
    prob_cheat: 0.18, // LOW risk (normal)
    status: "Active",
  },
  {
    id: "session-002",
    name: "John Reyes",
    prob_cheat: 0.32,
    status: "Active",
  },
  {
    id: "session-003",
    name: "Maria Santos",
    prob_cheat: 0.91,
    status: "Flagged",
  },
];

// ================= BEHAVIORAL LOGS =================
const mockBehavioralLogs = [
  { question: "Q1", label: "normal", time: "11:15" },
  { question: "Q2", label: "normal", time: "11:21" },
  { question: "Q3", label: "normal", time: "11:27" },
  { question: "Q4", label: "suspicious", time: "11:33" },
  { question: "Q5", label: "normal", time: "11:45" },
];

// ================= RUNTIME SECURITY =================
const mockRuntimeAlerts = [
  {
    id: 1,
    type: "Object Whitelisting Violation",
    question: "QNone",
  },
  {
    id: 2,
    type: "Scene Tampering",
    question: "QNone",
  },
];

export default function ProctorDashboardPage() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const classifyRisk = (prob) => {
    if (prob > 0.8) return "HIGH";
    if (prob > 0.5) return "MEDIUM";
    return "LOW";
  };

  const riskBorder = (prob) => {
    if (prob > 0.8) return "border-red-600";
    if (prob > 0.5) return "border-yellow-500";
    return "border-green-600";
  };

  const sortedStudents = useMemo(() => {
    return [...mockStudents].sort((a, b) => b.prob_cheat - a.prob_cheat);
  }, []);

  const total = sortedStudents.length;
  const high = sortedStudents.filter(
    (s) => classifyRisk(s.prob_cheat) === "HIGH",
  ).length;
  const medium = sortedStudents.filter(
    (s) => classifyRisk(s.prob_cheat) === "MEDIUM",
  ).length;
  const low = sortedStudents.filter(
    (s) => classifyRisk(s.prob_cheat) === "LOW",
  ).length;

  const suspiciousCount = mockBehavioralLogs.filter(
    (log) => log.label === "suspicious",
  ).length;

  const finalBehavior = suspiciousCount >= 3 ? "CHEATING" : "NORMAL";

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* ================= SUMMARY STRIP ================= */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white shadow rounded p-4">
            <p className="text-xs text-gray-500">Active Sessions</p>
            <p className="text-xl font-bold">{total}</p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <p className="text-xs text-gray-500">High Risk</p>
            <p className="text-xl font-bold text-red-600">{high}</p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <p className="text-xs text-gray-500">Medium Risk</p>
            <p className="text-xl font-bold text-yellow-600">{medium}</p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <p className="text-xs text-gray-500">Low Risk</p>
            <p className="text-xl font-bold text-green-600">{low}</p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <p className="text-xs text-gray-500">System Status</p>
            <p className="text-green-600 font-semibold">Operational</p>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-4 gap-6">
          {/* LEFT PANEL */}
          <div className="col-span-1 bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-4">Monitoring Queue</h2>

            {sortedStudents.map((student) => {
              const risk = classifyRisk(student.prob_cheat);

              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`border-2 rounded p-3 mb-3 cursor-pointer transition hover:shadow ${riskBorder(
                    student.prob_cheat,
                  )} ${
                    selectedStudent?.id === student.id ? "bg-gray-100" : ""
                  }`}
                >
                  <p className="font-semibold text-sm">{student.name}</p>

                  <p className="text-xs text-gray-600">
                    Risk Score: {(student.prob_cheat * 100).toFixed(1)}%
                  </p>

                  <p
                    className={`text-xs font-semibold ${
                      risk === "HIGH"
                        ? "text-red-600"
                        : risk === "MEDIUM"
                          ? "text-yellow-600"
                          : "text-green-600"
                    }`}
                  >
                    {risk}
                  </p>
                </div>
              );
            })}
          </div>

          {/* RIGHT PANEL */}
          <div className="col-span-3 bg-white shadow rounded p-6 space-y-6">
            {!selectedStudent && (
              <p className="text-gray-500">
                Select a student to inspect behavioral logs.
              </p>
            )}

            {selectedStudent && (
              <>
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    {selectedStudent.name}
                  </h2>

                  <p className="text-3xl font-bold">
                    {(selectedStudent.prob_cheat * 100).toFixed(2)}%
                  </p>

                  <p className="text-sm text-gray-600">
                    Classification: {classifyRisk(selectedStudent.prob_cheat)}
                  </p>
                </div>

                {/* Behavioral Monitoring */}
                <div>
                  <h3 className="font-semibold mb-3">Behavioral Monitoring</h3>

                  <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2 text-left">Question</th>
                        <th className="border p-2 text-left">Behavior</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockBehavioralLogs.map((log, index) => (
                        <tr key={index}>
                          <td className="border p-2">{log.question}</td>
                          <td
                            className={`border p-2 ${
                              log.label === "suspicious"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {log.label}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-4">
                    <p>
                      Total Suspicious Questions:{" "}
                      <span className="font-semibold">{suspiciousCount}</span>
                    </p>

                    <p
                      className={`mt-2 font-semibold ${
                        finalBehavior === "CHEATING"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      Overall Behavior Decision: {finalBehavior}
                    </p>
                  </div>
                </div>

                {/* Runtime Security Monitoring */}
                <div>
                  <h3 className="font-semibold mb-3">
                    Runtime Security Monitoring
                  </h3>

                  <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2 text-left">Type</th>
                        <th className="border p-2 text-left">Question</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRuntimeAlerts.map((alert) => (
                        <tr key={alert.id}>
                          <td className="border p-2">{alert.type}</td>
                          <td className="border p-2">{alert.question}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
