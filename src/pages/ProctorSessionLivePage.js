import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import socket from "../services/socket";

export default function ProctorSessionLivePage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [runtimeLogs, setRuntimeLogs] = useState([]);
  const [liveData, setLiveData] = useState(null);
  const [windowCount, setWindowCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH INITIAL DATA
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await api.get(`/sessions/${sessionId}`);
        const runtimeRes = await api.get(`/detections/session/${sessionId}`);

        setSession(sessionRes.data);
        setRuntimeLogs(runtimeRes.data || []);
      } catch (err) {
        console.error("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  // =========================
  // SOCKET LIVE STREAM
  // =========================
  useEffect(() => {
    socket.emit("join_session", sessionId);

    socket.on("live_status", (payload) => {
      if (payload.session_id !== sessionId) return;

      setLiveData(payload);
      setWindowCount((prev) => prev + 1);
    });

    socket.on("new_alert", (alert) => {
      if (alert.session_id !== sessionId) return;
      setRuntimeLogs((prev) => [alert, ...prev]);
    });

    return () => {
      socket.emit("leave_session", sessionId);
      socket.off("live_status");
      socket.off("new_alert");
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading monitoring console...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Session not found.
      </div>
    );
  }

  const probability = liveData?.prob_cheat ?? 0;
  const catActive = liveData?.cat_active === 1;

  const riskColor =
    probability > 0.8
      ? "bg-red-600"
      : probability > 0.5
        ? "bg-yellow-500"
        : "bg-green-600";

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Live Session Monitoring</h1>
          <p className="text-gray-600 text-sm">
            {session.examinee_name} — {session.exam_title}
          </p>
        </div>

        <button
          onClick={() => navigate("/proctor")}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back to Dashboard
        </button>
      </div>

      {/* SESSION SUMMARY STRIP */}
      <div className="bg-white shadow rounded p-6 grid grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-gray-500">Session Status</p>
          <p className="font-semibold">{session.status}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Windows Processed</p>
          <p className="font-semibold">{windowCount}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Decision Mode</p>
          <p className="font-semibold">{liveData?.decision_mode || "—"}</p>
        </div>
      </div>

      {/* AI PROBABILITY */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">AI Threat Probability</h2>

        <div className="w-full h-6 bg-gray-200 rounded overflow-hidden">
          <div
            className={`${riskColor} h-full transition-all duration-300`}
            style={{ width: `${probability * 100}%` }}
          />
        </div>

        <div className="flex justify-between mt-3 text-sm">
          <span>{(probability * 100).toFixed(2)}%</span>

          <span
            className={
              catActive
                ? "text-red-600 font-semibold"
                : "text-green-600 font-semibold"
            }
          >
            {catActive ? "CAT ACTIVE" : "Stable"}
          </span>
        </div>
      </div>

      {/* RUNTIME ALERTS */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Runtime Alerts</h2>

        {runtimeLogs.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No runtime violations detected.
          </p>
        ) : (
          runtimeLogs.map((log) => (
            <div key={log.id} className="border rounded p-3 mb-2 text-sm">
              {log.event_type}
            </div>
          ))
        )}
      </div>

      {/* FINALIZE */}
      <div className="text-right">
        <button
          onClick={async () => {
            try {
              await api.post("/detections/finalize-session", {
                session_id: sessionId,
              });
              navigate("/proctor");
            } catch (err) {
              alert("Finalize failed.");
            }
          }}
          className="bg-red-600 text-white px-6 py-2 rounded"
        >
          Finalize Session
        </button>
      </div>
    </div>
  );
}
