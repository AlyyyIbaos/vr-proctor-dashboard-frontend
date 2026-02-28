import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import StudentLayout from "../components/layout/StudentLayout";

const socket = io("https://vr-proctor-dashboard-backend.onrender.com");

// 🔹 MOCK STUDENTS FOR UI TESTING
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

// 🔹 MOCK BEHAVIORAL LOGS
const mockBehavioralLogs = [
  { window: 1, label: "normal", timestamp: new Date().toISOString() },
  { window: 2, label: "suspicious", timestamp: new Date().toISOString() },
  { window: 3, label: "normal", timestamp: new Date().toISOString() },
  { window: 4, label: "suspicious", timestamp: new Date().toISOString() },
  { window: 5, label: "suspicious", timestamp: new Date().toISOString() },
];

export default function ProctorDashboardPage() {
  const [sessions, setSessions] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 🔹 SOCKET LISTENER (kept intact)
  useEffect(() => {
    socket.on("live_status", (data) => {
      setSessions((prev) => ({
        ...prev,
        [data.session_id]: data,
      }));
    });

    return () => {
      socket.off("live_status");
    };
  }, []);

  const classifyRisk = (prob) => {
    if (prob > 0.8) return "HIGH";
    if (prob > 0.5) return "MEDIUM";
    return "LOW";
  };

  const riskColor = (prob) => {
    if (prob > 0.8) return "border-red-600";
    if (prob > 0.5) return "border-yellow-500";
    return "border-green-600";
  };

  const sortedStudents = useMemo(() => {
    return [...mockStudents].sort((a, b) => b.prob_cheat - a.prob_cheat);
  }, []);

  const suspiciousCount = mockBehavioralLogs.filter(
    (log) => log.label === "suspicious",
  ).length;

  const finalBehavior = suspiciousCount >= 3 ? "CHEATING" : "NORMAL";

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-4 gap-6">
        {/* LEFT PANEL — STUDENT QUEUE */}
        <div className="col-span-1 bg-white shadow rounded p-4">
          <h2 className="font-semibold mb-4">Active Monitoring Queue</h2>

          {sortedStudents.map((student) => {
            const risk = classifyRisk(student.prob_cheat);

            return (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className={`border-2 rounded p-3 mb-3 cursor-pointer transition hover:shadow ${riskColor(
                  student.prob_cheat,
                )} ${selectedStudent?.id === student.id ? "bg-gray-100" : ""}`}
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

        {/* RIGHT PANEL — LIVE DETAILS */}
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

              {/* Behavioral Logs */}
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
    </StudentLayout>
  );
}
