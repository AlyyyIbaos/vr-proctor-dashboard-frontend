import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import StudentLayout from "../components/layout/StudentLayout";

const socket = io("https://vr-proctor-dashboard-backend.onrender.com");

export default function ProctorDashboardPage() {
  const [sessions, setSessions] = useState({});
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    socket.on("live_status", (data) => {
      setSessions((prev) => {
        const existing = prev[data.session_id] || {
          probHistory: [],
          alerts: [],
        };

        return {
          ...prev,
          [data.session_id]: {
            ...existing,
            ...data,
            probHistory: [...existing.probHistory.slice(-20), data.prob_cheat],
          },
        };
      });
    });

    socket.on("new_alert", (alert) => {
      setSessions((prev) => {
        const existing = prev[alert.session_id] || {
          probHistory: [],
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

  // ===============================
  // RISK CLASSIFICATION
  // ===============================
  const classifyRisk = (prob) => {
    if (prob > 0.8) return "HIGH";
    if (prob > 0.5) return "MEDIUM";
    return "LOW";
  };

  const getRiskStyles = (prob) => {
    if (prob > 0.8) return "border-red-600 bg-red-50 animate-pulse";
    if (prob > 0.5) return "border-yellow-500 bg-yellow-50";
    return "border-green-600 bg-green-50";
  };

  // ===============================
  // AUTO SORT SESSIONS BY RISK
  // ===============================
  const sortedSessions = useMemo(() => {
    return Object.entries(sessions).sort((a, b) => {
      const riskOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };

      const riskA = classifyRisk(a[1]?.prob_cheat || 0);
      const riskB = classifyRisk(b[1]?.prob_cheat || 0);

      return riskOrder[riskB] - riskOrder[riskA];
    });
  }, [sessions]);

  const totalSessions = sortedSessions.length;
  const highRiskCount = sortedSessions.filter(
    ([, s]) => classifyRisk(s?.prob_cheat || 0) === "HIGH",
  ).length;
  const mediumRiskCount = sortedSessions.filter(
    ([, s]) => classifyRisk(s?.prob_cheat || 0) === "MEDIUM",
  ).length;

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">SynapSee Proctor Portal</h1>
            <p className="text-gray-600 text-sm">
              AI Behavioral Risk Monitoring Console
            </p>
          </div>

          <div className="text-sm text-gray-600">
            Live Sessions:{" "}
            <span className="font-semibold">{totalSessions}</span>
          </div>
        </div>

        {/* SUMMARY STRIP */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white shadow rounded p-4">
            <p className="text-sm text-gray-500">High Risk</p>
            <p className="text-xl font-bold text-red-600">{highRiskCount}</p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <p className="text-sm text-gray-500">Medium Risk</p>
            <p className="text-xl font-bold text-yellow-600">
              {mediumRiskCount}
            </p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <p className="text-sm text-gray-500">Total Active</p>
            <p className="text-xl font-bold">{totalSessions}</p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-4 gap-6">
          {/* LEFT PANEL */}
          <div className="col-span-1 bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold mb-4">
              Active Monitoring Queue
            </h2>

            {totalSessions === 0 && (
              <p className="text-gray-500 text-sm">
                No active sessions detected.
              </p>
            )}

            {sortedSessions.map(([id, data]) => {
              const prob = data?.prob_cheat || 0;
              const risk = classifyRisk(prob);

              return (
                <div
                  key={id}
                  onClick={() => setSelectedSession(id)}
                  className={`cursor-pointer p-3 rounded mb-3 border-2 transition ${
                    selectedSession === id
                      ? "border-black"
                      : getRiskStyles(prob)
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">
                      {id.slice(0, 8)}...
                    </span>
                    <span className="text-xs font-bold">{risk}</span>
                  </div>

                  <p className="text-xs text-gray-600 mt-1">
                    Prob: {(prob * 100).toFixed(1)}%
                  </p>
                </div>
              );
            })}
          </div>

          {/* RIGHT PANEL */}
          <div className="col-span-3 bg-white shadow rounded p-6">
            {!selectedSession && (
              <p className="text-gray-500">
                Select a session to view detailed intelligence.
              </p>
            )}

            {selectedSession && (
              <>
                <h2 className="text-xl font-bold mb-4">Session Intelligence</h2>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Session ID</p>
                    <p className="font-semibold text-sm">{selectedSession}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Current Probability</p>
                    <p className="text-xl font-bold">
                      {(
                        (sessions[selectedSession]?.prob_cheat || 0) * 100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">CAT Status</p>
                    <p
                      className={
                        sessions[selectedSession]?.cat_active === 1
                          ? "text-red-600 font-semibold"
                          : "text-green-600 font-semibold"
                      }
                    >
                      {sessions[selectedSession]?.cat_active === 1
                        ? "ACTIVE"
                        : "Stable"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Runtime Alerts</h3>

                  {sessions[selectedSession]?.alerts.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No runtime alerts detected.
                    </p>
                  ) : (
                    sessions[selectedSession]?.alerts.map((a) => (
                      <div
                        key={a.id}
                        className="border rounded p-2 mb-2 text-sm"
                      >
                        <strong>{a.event_type}</strong> — {a.severity}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
