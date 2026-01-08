import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/ui/StatCard";
import LiveChart from "../components/charts/LiveChart";
import CheatingLog from "../components/logs/CheatingLog";
import LiveAlertPanel from "../components/alerts/LiveAlertPanel";
import socket from "../services/socket";
import { useRef } from "react";


export default function DashboardPage() {
  // =========================
  // STATE
  // =========================
  const [alerts, setAlerts] = useState([]);
  const alertRef = useRef(null);
  const scrollToAlerts = () => {
    alertRef.current?.scrollIntoView({behavior:"smooth"})
  };
  // =========================
  // SOCKET LISTENER
  // =========================
  useEffect(() => {
    socket.on("new_alert", (alert) => {
      setAlerts((prev) => [alert, ...prev]);
    });


    return () => {
      socket.off("new_alert");
    };
  }, []);


  // =========================
  // MOCK DATA (CAN REMOVE LATER)
  // =========================
  const mockStats = [
    { label: "Active Examinees", value: 24 },
    { label: "Flagged Sessions", value: alerts.length },
    { label: "Average Risk Score", value: "18%" },
  ];


  const mockLogs = [
    { type: "Head Movement", confidence: 82 },
    { type: "Voice Detected", confidence: 76 },
    { type: "Object Injection", confidence: 91 },
  ];


  // =========================
  // RENDER
  // =========================
  return (
    <DashboardLayout title="Dashboard" alertCount={alerts.length} onAlertClick={scrollToAlerts}>
     
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {mockStats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>


      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       
        {/* LEFT: LIVE CHART */}
        <div className="lg:col-span-2 space-y-6">
          <LiveChart />
          <CheatingLog logs={mockLogs} />
        </div>


        {/* RIGHT: LIVE ALERTS */}
        <div ref={alertRef}>
        <LiveAlertPanel alerts={alerts} />
        </div>
      </div>


    </DashboardLayout>
  );
}



