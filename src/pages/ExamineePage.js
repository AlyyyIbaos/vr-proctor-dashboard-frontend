import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import ExamineeOverview from "../components/overview/ExamineeOverview";
import LiveMonitoringPanel from "../components/monitoring/LiveMonitoringPanel";
import CheatingLog from "../components/logs/CheatingLog";

import socket from "../services/socket";

export default function ExamineePage() {
  const { sessionId } = useParams();

  // ✅ ALL HOOKS MUST BE DECLARED FIRST
  const [session, setSession] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================
  // FETCH SESSION DETAILS
  // ============================
  useEffect(() => {
    // 🚫 If sessionId is missing, do not fetch
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/sessions/${sessionId}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch session");
        }

        const data = await res.json();

        console.log("SESSION DETAILS RESPONSE:", data);

        setSession({
          id: data.id,
          status: data.status,
          riskLevel:
          data.risk_level.charAt(0).toUpperCase() +
          data.risk_level.slice(1),

          examinee_name: data.examinee_name,
          exam_title: data.exam_title,

          score: data.score,
          max_score: data.max_score,
        });

        setAlerts(data.alerts || []);
        setLogs(data.alerts || []);
      } catch (error) {
        console.error("FETCH SESSION ERROR:", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  // ============================
  // SOCKET.IO — LIVE ALERTS
  // ============================
  useEffect(() => {
    if (!sessionId) return;

    socket.emit("join_session", sessionId);

    socket.on("new_alert", (alert) => {
      setAlerts((prev) => [alert, ...prev]);
      setLogs((prev) => [alert, ...prev]);
    });

    return () => {
      socket.off("new_alert");
      socket.emit("leave_session", sessionId);
    };
  }, [sessionId]);

  // ============================
  // RENDER LOGIC (AFTER HOOKS)
  // ============================
  if (!sessionId) {
    return (
      <DashboardLayout title="Examinee Monitoring">
        <p className="p-6 text-gray-500">
          Please select an examinee from the Live Exams page.
        </p>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout title="Examinee Monitoring">
        <p className="p-6 text-gray-500">
          Loading examinee session...
        </p>
      </DashboardLayout>
    );
  }

  if (!session) {
    return (
      <DashboardLayout title="Examinee Monitoring">
        <p className="p-6 text-red-500">
          Failed to load session data.
        </p>
      </DashboardLayout>
    );
  }

  // ============================
  // PAGE RENDER
  // ============================
  return (
    <DashboardLayout title="Examinee Monitoring">
      <div className="space-y-6">

        <ExamineeOverview session={session} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">
            <LiveMonitoringPanel alerts={alerts} />
          </div>

          <CheatingLog logs={logs} />

        </div>
      </div>
    </DashboardLayout>
  );
}
