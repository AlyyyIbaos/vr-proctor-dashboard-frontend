import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import StudentLayout from "../components/layout/StudentLayout";

const socket = io("https://vr-proctor-dashboard-backend.onrender.com");

const mockBehavioralLogs = [
  { window: 1, label: "normal", timestamp: new Date().toISOString() },
  { window: 2, label: "suspicious", timestamp: new Date().toISOString() },
  { window: 3, label: "normal", timestamp: new Date().toISOString() },
  { window: 4, label: "suspicious", timestamp: new Date().toISOString() },
  { window: 5, label: "suspicious", timestamp: new Date().toISOString() },
];

export default function ProctorDashboardPage() {
  const [sessions, setSessions] = useState({});
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    socket.on("live_status", (data) => {
      setSessions((prev) => ({
        ...prev,
        [data.session_id]: {
          ...(prev[data.session_id] || { alerts: [] }),
          ...data,
        },
      }));
    });

    socket.on("new_alert", (alert) => {
      setSessions((prev) => ({
        ...prev,
        [alert.session_id]: {
          ...(prev[alert.session_id] || { alerts: [] }),
          alerts: [...(prev[alert.session_id]?.alerts || []), alert],
        },
      }));
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
    return Object.entries(sessions);
  }, [sessions]);

  const suspiciousCount = mockBehavioralLogs.filter(
    (log) => log.label === "suspicious",
  ).length;

  const finalBehavior = suspiciousCount >= 3 ? "CHEATING" : "NORMAL";

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">SynapSee Proctor Dashboard</h1>

        {/* TAB NAVIGATION */}
        <div className="flex gap-4 border-b pb-2">
          {["overview", "live", "credentials"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t ${
                activeTab === tab
                  ? "bg-white shadow font-semibold"
                  : "text-gray-500"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="bg-white shadow rounded p-6 space-y-2">
            <p>Total Active Sessions: {sortedSessions.length}</p>
            <p>
              Flagged Sessions:{" "}
              {
                sortedSessions.filter(
                  ([, s]) => classifyRisk(s?.prob_cheat || 0) === "HIGH",
                ).length
              }
            </p>
            <p className="text-green-600 font-semibold">
              System Status: Operational
            </p>
          </div>
        )}

        {/* LIVE SESSION */}
        {activeTab === "live" && (
          <div className="bg-white shadow rounded p-6 space-y-4">
            <h2 className="font-semibold">Behavioral Logs (Mock Data)</h2>

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

            <div className="pt-3 border-t">
              <p>Suspicious Total: {suspiciousCount}</p>
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
        )}

        {/* CREDENTIALS */}
        {activeTab === "credentials" && (
          <div className="bg-white shadow rounded p-6 space-y-2">
            <p>Examinee Name: Mock Student</p>
            <p>Student Number: 2023-00001</p>
            <p>Program: BS Computer Engineering</p>
            <p>Year Level: 3</p>
            <p>Status: Active</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
