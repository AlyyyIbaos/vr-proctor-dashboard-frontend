import { useMemo, useState } from "react";
import StudentLayout from "../components/layout/StudentLayout";

/* ================= MOCK DATA ================= */

const mockStudents = [
  { id: "1", name: "Alyssa", prob_cheat: 0.18, status: "Active" },
  { id: "2", name: "John Reyes", prob_cheat: 0.32, status: "Active" },
  { id: "3", name: "Maria Santos", prob_cheat: 0.91, status: "Flagged" },
];

const mockBehavioralLogs = [
  { question: "Q1", label: "normal", time: "11:15" },
  { question: "Q2", label: "normal", time: "11:21" },
  { question: "Q3", label: "normal", time: "11:27" },
  { question: "Q4", label: "suspicious", time: "11:33" },
  { question: "Q5", label: "normal", time: "11:45" },
];

const mockRuntimeLogs = [
  { id: 1, type: "Object Injection", time: "6:17 PM" },
  { id: 2, type: "Scene Tampering", time: "5:58 PM" },
];

const mockExamSessions = [
  {
    id: "exam1",
    title: "Midterm Exam",
    students: mockStudents,
  },
];

/* ================= COMPONENT ================= */

export default function ProctorDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const classifyRisk = (prob) => {
    if (prob > 0.8) return "High";
    if (prob > 0.5) return "Medium";
    return "Low";
  };

  const sortedStudents = useMemo(() => {
    return [...mockStudents].sort((a, b) => b.prob_cheat - a.prob_cheat);
  }, []);

  const highRiskCount = sortedStudents.filter(
    (s) => classifyRisk(s.prob_cheat) === "High",
  ).length;

  const avgRisk =
    sortedStudents.reduce((acc, s) => acc + s.prob_cheat, 0) /
    sortedStudents.length;

  const suspiciousCount = mockBehavioralLogs.filter(
    (log) => log.label === "suspicious",
  ).length;

  const finalBehavior = suspiciousCount >= 3 ? "CHEATING" : "NORMAL";

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* ================= TAB HEADER ================= */}
        <div className="flex space-x-8 border-b pb-3">
          {["overview", "sessions"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedExam(null);
                setSelectedStudent(null);
              }}
              className={`capitalize pb-2 ${
                activeTab === tab
                  ? "border-b-2 border-red-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ===================================================== */}
        {/* ================= OVERVIEW TAB ======================= */}
        {/* ===================================================== */}

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white shadow rounded p-4">
                <p className="text-sm text-gray-500">Active Examinees</p>
                <p className="text-2xl font-bold">{sortedStudents.length}</p>
              </div>

              <div className="bg-white shadow rounded p-4">
                <p className="text-sm text-gray-500">Flagged Sessions</p>
                <p className="text-2xl font-bold text-red-600">
                  {highRiskCount}
                </p>
              </div>

              <div className="bg-white shadow rounded p-4">
                <p className="text-sm text-gray-500">Average Risk Score</p>
                <p className="text-2xl font-bold">
                  {(avgRisk * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            {/* LIVE ALERTS */}
            <div className="bg-white shadow rounded p-6">
              <h3 className="font-semibold mb-3">Live Cheating Alerts</h3>
              <p className="text-gray-500 text-sm">No alerts detected yet.</p>
            </div>

            {/* RUNTIME SECURITY LOGS */}
            <div className="bg-white shadow rounded p-6">
              <h3 className="font-semibold mb-3">Runtime Security Logs</h3>

              {mockRuntimeLogs.map((log) => (
                <div
                  key={log.id}
                  className="border rounded p-3 mb-2 flex justify-between text-sm"
                >
                  <span>{log.type}</span>
                  <span className="text-gray-400">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* ================= SESSIONS TAB ======================= */}
        {/* ===================================================== */}

        {activeTab === "sessions" && (
          <div className="bg-white shadow rounded p-6">
            {/* STEP 1: LIST EXAMS */}
            {!selectedExam && (
              <>
                <h3 className="font-semibold mb-4">Exam Sessions</h3>

                {mockExamSessions.map((exam) => (
                  <div
                    key={exam.id}
                    onClick={() => setSelectedExam(exam)}
                    className="border rounded p-3 mb-3 cursor-pointer hover:shadow"
                  >
                    {exam.title}
                  </div>
                ))}
              </>
            )}

            {/* STEP 2: LIST STUDENTS */}
            {selectedExam && !selectedStudent && (
              <>
                <button
                  onClick={() => setSelectedExam(null)}
                  className="text-sm text-gray-500 mb-4"
                >
                  ← Back
                </button>

                <h3 className="font-semibold mb-4">{selectedExam.title}</h3>

                {selectedExam.students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="border rounded p-3 mb-2 cursor-pointer hover:shadow flex justify-between"
                  >
                    <span>{student.name}</span>
                    <span className="text-sm text-gray-500">
                      {student.status}
                    </span>
                  </div>
                ))}
              </>
            )}

            {/* STEP 3: STUDENT SESSION DETAILS */}
            {selectedExam && selectedStudent && (
              <>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-sm text-gray-500 mb-4"
                >
                  ← Back to Examinees
                </button>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedStudent.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Risk Level: {classifyRisk(selectedStudent.prob_cheat)}
                    </p>
                  </div>

                  {/* BEHAVIORAL LOGS */}
                  <div>
                    <h3 className="font-semibold mb-3">
                      Behavioral Monitoring (CNN-LSTM)
                    </h3>

                    <table className="w-full border text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border p-2 text-left">Question</th>
                          <th className="border p-2 text-left">Behavior</th>
                          <th className="border p-2 text-left">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockBehavioralLogs.map((log, index) => (
                          <tr key={index}>
                            <td className="border p-2">{log.question}</td>
                            <td
                              className={`border p-2 ${
                                log.label === "suspicious"
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {log.label}
                            </td>
                            <td className="border p-2 text-gray-500">
                              {log.time}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-4 text-sm">
                      <p>Suspicious Events: {suspiciousCount}</p>

                      <p
                        className={`mt-2 font-semibold ${
                          finalBehavior === "CHEATING"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        Final Behavioral Decision: {finalBehavior}
                      </p>
                    </div>
                  </div>

                  {/* RUNTIME SECURITY */}
                  <div>
                    <h3 className="font-semibold mb-3">
                      Runtime Security Logs
                    </h3>

                    {mockRuntimeLogs.map((log) => (
                      <div
                        key={log.id}
                        className="border rounded p-3 mb-2 flex justify-between text-sm"
                      >
                        <span>{log.type}</span>
                        <span className="text-gray-400">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
