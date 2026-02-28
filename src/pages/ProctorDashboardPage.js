import { useMemo, useState } from "react";
import StudentLayout from "../components/layout/StudentLayout";

// ================= MOCK STUDENTS =================
const mockStudents = [
  {
    id: "session-001",
    name: "Alyssa Cruz",
    prob_cheat: 0.78,
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

// ================= MOCK BEHAVIORAL LOGS =================
const mockBehavioralLogs = [
  { window: 1, label: "normal", timestamp: new Date().toISOString() },
  { window: 2, label: "suspicious", timestamp: new Date().toISOString() },
  { window: 3, label: "normal", timestamp: new Date().toISOString() },
  { window: 4, label: "suspicious", timestamp: new Date().toISOString() },
  { window: 5, label: "suspicious", timestamp: new Date().toISOString() },
];

// ================= MOCK RUNTIME ALERTS =================
const mockRuntimeAlerts = [
  {
    id: 1,
    type: "Object Injection Detected",
    severity: "HIGH",
    confidence: 0.94,
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    type: "Scene Tampering Attempt",
    severity: "MEDIUM",
    confidence: 0.72,
    timestamp: new Date().toISOString(),
  },
];

export default function ProctorDashboardPage() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  // ================= RISK CLASSIFICATION =================
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

  // ================= SORT STUDENTS BY RISK =================
  const sortedStudents = useMemo(() => {
    return [...mockStudents].sort((a, b) => b.prob_cheat - a.prob_cheat);
  }, []);

  // ================= SUMMARY METRICS =================
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

  // ================= BEHAVIOR LOGIC =================
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

        {/* ================= MAIN MONITORING GRID ================= */}
        <div className="grid grid-cols-4 gap-6">
          {/* LEFT PANEL — MONITORING QUEUE */}
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

          {/* RIGHT PANEL — LIVE SESSION DETAILS */}
          <div className="col-span-3 bg-white shadow rounded p-6 space-y-6">
            {!selectedStudent && (
              <p className="text-gray-500">
                Select a student to inspect behavioral logs.
              </p>
            )}

            {selectedStudent && (
              <>
                {/* Risk Overview */}
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

                {/* Behavioral Window Logs */}
                <div>
                  <h3 className="font-semibold mb-3">Behavioral Window Logs</h3>

                  {mockBehavioralLogs.map((log, index) => (
                    <div
                      key={index}
                      className="border rounded p-2 mb-2 flex justify-between text-sm"
                    >
                      <span>Window {log.window}</span>

                      <span
                        className={
                          log.label === "suspicious"
                            ? "text-red-600 font-semibold"
                            : "text-green-600"
                        }
                      >
                        {log.label.toUpperCase()}
                      </span>

                      <span className="text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* ================= RUNTIME SECURITY ALERTS ================= */}
                <div>
                  <h3 className="font-semibold mb-3">
                    Runtime Security Alerts
                  </h3>

                  {mockRuntimeAlerts.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No runtime violations detected.
                    </p>
                  ) : (
                    mockRuntimeAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`border-l-4 rounded p-3 mb-3 text-sm shadow-sm ${
                          alert.severity === "HIGH"
                            ? "border-red-600 bg-red-50"
                            : alert.severity === "MEDIUM"
                              ? "border-yellow-500 bg-yellow-50"
                              : "border-green-600 bg-green-50"
                        }`}
                      >
                        <div className="flex justify-between">
                          <span className="font-semibold">{alert.type}</span>

                          <span
                            className={`font-semibold ${
                              alert.severity === "HIGH"
                                ? "text-red-600"
                                : alert.severity === "MEDIUM"
                                  ? "text-yellow-600"
                                  : "text-green-600"
                            }`}
                          >
                            {alert.severity}
                          </span>
                        </div>

                        <div className="flex justify-between mt-1 text-gray-600">
                          <span>
                            Confidence: {(alert.confidence * 100).toFixed(1)}%
                          </span>

                          <span>
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Final Decision */}
                <div className="border-t pt-4">
                  <p>
                    Suspicious Total:{" "}
                    <span className="font-semibold">{suspiciousCount}</span>
                  </p>

                  <p
                    className={`font-bold ${
                      finalBehavior === "CHEATING"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    Final Behavior: {finalBehavior}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
