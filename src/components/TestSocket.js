import React, { useEffect } from "react";
import socket from "../services/socket";

const TestSocket = () => {
  useEffect(() => {
    socket.on("new_alert", (alert) => {
      console.log("🚨 NEW ALERT RECEIVED:", alert);
    });

    return () => {
      socket.off("new_alert");
    };
  }, []);

  const sendTestAlert = () => {
    socket.emit("new_detection", {
      session_id: "d9bf302d-9cbb-4ea6-9b36-a1f88fda8996",
      behavior_type: "Head Movement",
      description: "Frequent head turning detected",
      confidence: 92,
      severity: "high",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Socket.IO Test</h2>
      <button onClick={sendTestAlert}>
        Send Test Alert
      </button>
    </div>
  );
};

export default TestSocket;
