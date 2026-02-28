import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import StudentLayout from "../components/layout/StudentLayout";

const socket = io("https://vr-proctor-dashboard-backend.onrender.com");

// 🔹 MOCK BEHAVIORAL DATA (FOR UI TESTING)
const mockBehavioralLogs = [
  { window: 1, label: "normal", timestamp: new Date().toISOString() },
  { window: 2, label: "suspicious", timestamp: new Date().toISOString() },
  { window: 3, label: "normal", timestamp: new Date().toISOString() },
  { window: 4, label: "suspicious", timestamp: new Date().toISOString() },
  { window: 5, label: "suspicious", timestamp: new Date().toISOString() },
];

export default function ProctorDashboardPage() {
  const [sessions, setSessions] = useState({});
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    socket.on("live_status", (data) => {
      setSessions((prev) => {
        const existing = prev[data.session_id] || {
          alerts: [],
        };

        return {
          ...prev,
          [data.session_id]: {
            ...existing,
            ...data,
          },
        };
      });
    });

    socket.on("new_alert", (alert) => {
      setSessions((prev) => {
        const existing = prev[alert.session_id] || {
          alerts: [],
        };

        return {
          ...prev,
          [alert.session_id]: {
            ...existing,
            alerts: [...existing.alerts, alert],
          },
        };
      });
    });

    return () => {
      socket.off("live_status");
      socket.off("new_alert");
    };
  }, []);

  const classifyRisk = (prob) => {
    if (prob > 0.8) return "HIGH";
    if (prob > 0.5) return "MEDIUM";
    return "LOW";
  };

  const sortedSessions = useMemo(() => {
    return Object.entries(sessions).sort((a, b) => {
      const riskOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      const riskA = classifyRisk(a[1]?.prob_cheat || 0);
      const riskB = classifyRisk(b[1]?.prob_cheat || 0);
      return riskOrder[riskB] - riskOrder[riskA];
    });
  }, [sessions]);

  const selectedData = selectedSession ? sessions[selectedSession] : null;

  // 🔹 BEHAVIORAL CLASSIFICATION
  const suspiciousCount = mockBehavioralLogs.filter(
    (log) => log.label === "suspicious",
  ).length;

  const finalBehavior = suspiciousCount >= 3 ? "CHEATING" : "NORMAL";

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">SynapSee Proctor Dashboard</h1>
          <p className="text-gray-600 text-sm">
            Centralized Live Examination Monitoring Interface
          </p>
        </div>

        {/* SESSION OVERVIEW PANEL */}
        <div className="bg-white shadow rounded p-6 grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Active Sessions</p>
            <p className="text-xl font-bold">{sortedSessions.length}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Flagged Sessions</p>
            <p className="text-xl font-bold text-red-600">
              {
                sortedSessions.filter(
                  ([, s]) => classifyRisk(s?.prob_cheat || 0) === "HIGH",
                ).length
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">System Status</p>
            <p className="text-green-600 font-semibold">Operational</p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-4 gap-6">
          {/* SESSION LIST */}
          <div className="col-span-1 bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-4">Session Queue</h2>

            {sortedSessions.length === 0 && (
              <p className="text-gray-500 text-sm">No active sessions.</p>
            )}

            {sortedSessions.map(([id, data]) => {
              const risk = classifyRisk(data?.prob_cheat || 0);

              return (
                <div
                  key={id}
                  onClick={() => setSelectedSession(id)}
                  className="border rounded p-3 mb-3 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">
                      {id.slice(0, 8)}...
                    </span>
                    <span
                      className={
                        risk === "HIGH"
                          ? "text-red-600 font-bold"
                          : risk === "MEDIUM"
                            ? "text-yellow-600 font-bold"
                            : "text-green-600 font-bold"
                      }
                    >
                      {risk}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    Risk Score: {((data?.prob_cheat || 0) * 100).toFixed(1)}%
                  </p>
                </div>
              );
            })}
          </div>

          {/* SESSION DETAIL */}
          <div className="col-span-3 bg-white shadow rounded p-6 space-y-6">
            {!selectedSession && (
              <p className="text-gray-500">Select a session to inspect.</p>
            )}

            {selectedSession && selectedData && (
              <>
                {/* REAL-TIME RISK */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">
                    Real-Time Risk Monitoring
                  </h2>

                  <div className="text-2xl font-bold">
                    {((selectedData.prob_cheat || 0) * 100).toFixed(2)}%
                  </div>

                  <p className="text-sm text-gray-600">
                    Classification: {classifyRisk(selectedData.prob_cheat || 0)}
                  </p>
                </div>

                {/* RUNTIME ALERTS */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">
                    Runtime Security Alerts
                  </h2>

                  {selectedData.alerts?.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No security violations.
                    </p>
                  ) : (
                    selectedData.alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="border p-2 rounded mb-2 text-sm"
                      >
                        {alert.event_type} — {alert.severity}
                      </div>
                    ))
                  )}
                </div>

                {/* BEHAVIORAL ANALYSIS */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">
                    Behavioral Analysis
                  </h2>

                  <div className="space-y-2">
                    {mockBehavioralLogs.map((log, index) => (
                      <div
                        key={index}
                        className="border rounded p-2 flex justify-between text-sm"
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

                  <div className="mt-4">
                    <p>
                      Total Suspicious:{" "}
                      <span className="font-semibold">{suspiciousCount}</span>
                    </p>

                    <p
                      className={
                        finalBehavior === "CHEATING"
                          ? "text-red-600 font-bold"
                          : "text-green-600 font-bold"
                      }
                    >
                      Final Behavior: {finalBehavior}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
