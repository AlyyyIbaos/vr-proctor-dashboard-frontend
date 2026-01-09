import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function StudentPanel() {
  // ============================
  // STATE (DEMO / DOC DATA)
  // ============================
  const [student, setStudent] = useState(null);
  const [exam, setExam] = useState(null);
  const [violations, setViolations] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================
  // DEMO DATA (FOR PRESENTATION)
  // ============================
  useEffect(() => {
    // Identity
    setStudent({
      name: "Juan Dela Cruz",
      email: "juan.delacruz@university.edu",
      student_number: "2021-04567",
      program: "BS Computer Science",
      year_level: "3",
    });

    // Exam status
    setExam({
      title: "CS101 – Final Exam",
      status: "Completed",
      started_at: "09:10 AM",
      ended_at: "09:40 AM",
    });

    // Scores
    setScores([
      {
        exam: "CS101 – Final Exam",
        score: 85,
        max_score: 100,
        passed: true,
      },
    ]);

    // Violations / cheating logs
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
  }, []);

  // ============================
  // LOADING STATE
  // ============================
  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-gray-500">Loading student panel...</p>
      </DashboardLayout>
    );
  }

  // ============================
  // PAGE CONTENT
  // ============================
  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* STUDENT IDENTITY */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold text-pup-maroon mb-2">
            Student Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Student Number:</strong> {student.student_number}</p>
            <p><strong>Program:</strong> {student.program}</p>
            <p><strong>Year Level:</strong> {student.year_level}</p>
          </div>
        </div>

        {/* EXAM STATUS */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold text-pup-maroon mb-2">
            Exam Status
          </h2>

          <p><strong>Exam:</strong> {exam.title}</p>
          <p><strong>Status:</strong> {exam.status}</p>
          <p>
            <strong>Time:</strong> {exam.started_at} – {exam.ended_at}
          </p>
        </div>

        {/* EXAM SCORES */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold text-pup-maroon mb-2">
            Exam Scores
          </h2>

          {scores.length === 0 ? (
            <p className="text-gray-500">No exam scores available.</p>
          ) : (
            scores.map((s, index) => (
              <div key={index} className="border-b py-2 text-sm">
                {s.exam}:{" "}
                <strong>
                  {s.score}/{s.max_score}
                </strong>{" "}
                {s.passed ? "✅ Passed" : "❌ Failed"}
              </div>
            ))
          )}
        </div>

        {/* VIOLATIONS */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold text-pup-maroon mb-2">
            Violations / Cheating Logs
          </h2>

          {violations.length === 0 ? (
            <p className="text-gray-500">No violations detected.</p>
          ) : (
            violations.map((v, index) => (
              <div key={index} className="border-b py-2 text-sm">
                <p>
                  <strong>{v.type}</strong> ({v.severity})
                </p>
                <p className="text-gray-600">
                  Confidence: {v.confidence} • Time: {v.time}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
