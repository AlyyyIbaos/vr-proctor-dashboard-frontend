import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/synapsee-logo.png";

const API_URL = process.env.REACT_APP_API_URL;

export default function StudentPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("exam_token");

  // ============================
  // STATE
  // ============================
  const [student, setStudent] = useState(null);
  const [exam, setExam] = useState(null);
  const [violations, setViolations] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================
  // DEMO DATA FETCH
  // ============================
  useEffect(() => {
    // Demo-safe fallback if token is missing
    if (!token) {
      setStudent({
        name: "Juan Dela Cruz",
        email: "juan.delacruz@university.edu",
      });
    }

    // ---- MOCK / DEMO DATA ----
    setStudent({
      name: "Juan Dela Cruz",
      email: "juan.delacruz@university.edu",
    });

    setExam({
      status: "Last Exam Completed",
      exam_title: "CS101 – Final Exam",
      started_at: "09:10 AM",
      ended_at: "09:40 AM",
    });

    setScores([
      {
        exam: "CS101 – Final Exam",
        score: 85,
        max: 100,
        passed: true,
      },
    ]);

    setViolations([
      {
        type: "Object Injection",
        severity: "High",
        confidence: "87%",
        time: "09:22 AM",
      },
      {
        type: "Scene Tampering",
        severity: "Medium",
        confidence: "64%",
        time: "09:30 AM",
      },
    ]);

    setLoading(false);
  }, [token]);

  // ============================
  // LOGOUT
  // ============================
  const logout = () => {
    localStorage.removeItem("exam_token");
    navigate("/");
  };

  // ============================
  // RENDER
  // ============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading student panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <img src={logo} alt="Synapsee Logo" className="h-12" />
          <div>
            <h2 className="text-xl font-semibold text-pup-maroon">
              Student Panel
            </h2>
            <p className="text-sm text-gray-600">
              {student.name} • {student.email}
            </p>
          </div>
        </div>

        {/* EXAM STATUS */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2 text-pup-maroon">
            Exam Status
          </h3>
          <p><strong>Exam:</strong> {exam.exam_title}</p>
          <p><strong>Status:</strong> {exam.status}</p>
          <p>
            <strong>Time:</strong> {exam.started_at} – {exam.ended_at}
          </p>
        </div>

        {/* SCORES */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2 text-pup-maroon">
            Exam Scores
          </h3>
          {scores.map((s, i) => (
            <div key={i} className="border-b py-2">
              {s.exam}: <strong>{s.score}/{s.max}</strong>{" "}
              {s.passed ? "✅ Passed" : "❌ Failed"}
            </div>
          ))}
        </div>

        {/* VIOLATIONS */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2 text-pup-maroon">
            Violations / Cheating Logs
          </h3>

          {violations.length === 0 ? (
            <p className="text-gray-500">No violations detected.</p>
          ) : (
            violations.map((v, i) => (
              <div key={i} className="border-b py-2">
                <p>
                  <strong>{v.type}</strong> ({v.severity})
                </p>
                <p className="text-sm text-gray-600">
                  Confidence: {v.confidence} • Time: {v.time}
                </p>
              </div>
            ))
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end">
          <button
            onClick={logout}
            className="bg-pup-maroon text-white px-6 py-2 rounded hover:bg-pup-goldDark transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
