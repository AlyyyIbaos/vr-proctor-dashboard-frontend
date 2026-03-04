import { useMemo, useState } from "react";
import StudentLayout from "../components/layout/StudentLayout";

/* ================= MOCK DATA ================= */

const mockStudents = [
  { id: "1", name: "Alyssa", prob_cheat: 0.18, status: "Active" },
  { id: "2", name: "John Reyes", prob_cheat: 0.62, status: "Active" },
  { id: "3", name: "Maria Santos", prob_cheat: 0.91, status: "Flagged" },
];

const mockBehavioralLogs = [
  { question: "Q1", label: "normal", time: "11:15", confidence: 0.88 },
  { question: "Q2", label: "normal", time: "11:21", confidence: 0.91 },
  { question: "Q3", label: "normal", time: "11:27", confidence: 0.85 },
  { question: "Q4", label: "suspicious", time: "11:33", confidence: 0.94 },
  { question: "Q5", label: "suspicious", time: "11:40", confidence: 0.97 },
  { question: "Q6", label: "suspicious", time: "11:45", confidence: 0.96 },
];

const mockRuntimeLogs = [
  { id: 1, type: "Object Injection", severity: "HIGH", time: "6:17 PM" },
  { id: 2, type: "Scene Tampering", severity: "MEDIUM", time: "5:58 PM" },
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

  const behavioralDecision = suspiciousCount >= 3 ? "CHEATING" : "NORMAL";

  const runtimeHighSeverity = mockRuntimeLogs.some(
    (log) => log.severity === "HIGH",
  );

  const sessionFlagged =
    behavioralDecision === "CHEATING" || runtimeHighSeverity;

  const riskBarColor = (prob) =>
    prob > 0.8 ? "bg-red-600" : prob > 0.5 ? "bg-yellow-500" : "bg-green-600";

  const severityColor = (level) =>
    level === "HIGH"
      ? "bg-red-100 text-red-700"
      : level === "MEDIUM"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-600";

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* ================= TABS ================= */}
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

            {/* LIVE INDICATOR */}
            <div className="bg-white shadow rounded p-4 flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                Live Monitoring Active
              </span>
            </div>

            {/* RUNTIME SECURITY LOGS */}
            <div className="bg-white shadow rounded p-6">
              <h3 className="font-semibold mb-3">Runtime Security Logs</h3>

              {mockRuntimeLogs.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No runtime violations detected.
                </p>
              )}

              {mockRuntimeLogs.map((log) => (
                <div
                  key={log.id}
                  className="border rounded p-3 mb-2 flex justify-between text-sm"
                >
                  <div>
                    <p className="font-medium">{log.type}</p>
                    <span
                      className={`px-2 py-1 text-xs rounded ${severityColor(
                        log.severity,
                      )}`}
                    >
                      {log.severity}
                    </span>
                  </div>
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

            {selectedExam && selectedStudent && (
              <>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-sm text-gray-500 mb-4"
                >
                  ← Back to Examinees
                </button>

                {/* HEADER */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {selectedStudent.name}
                  </h2>

                  {sessionFlagged && (
                    <span className="px-3 py-1 bg-red-600 text-white text-xs rounded">
                      FLAGGED SESSION
                    </span>
                  )}
                </div>

                {/* RISK BAR */}
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    AI Threat Probability
                  </p>
                  <div className="w-full h-4 bg-gray-200 rounded">
                    <div
                      className={`${riskBarColor(
                        selectedStudent.prob_cheat,
                      )} h-4 rounded`}
                      style={{
                        width: `${selectedStudent.prob_cheat * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-sm mt-2">
                    {(selectedStudent.prob_cheat * 100).toFixed(2)}%
                  </p>
                </div>

                {/* SESSION VERDICT */}
                <div className="mt-6 bg-gray-50 p-4 rounded border">
                  <h3 className="font-semibold mb-2">AI Session Verdict</h3>
                  <p>Behavioral: {behavioralDecision}</p>
                  <p>
                    Runtime Violations:{" "}
                    {runtimeHighSeverity ? "Detected" : "None"}
                  </p>
                  <p className="font-semibold mt-2">
                    Final: {sessionFlagged ? "FLAGGED" : "NORMAL"}
                  </p>
                </div>

                {/* BEHAVIORAL TIMELINE */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Behavioral Timeline</h3>

                  {mockBehavioralLogs.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      No behavioral logs recorded.
                    </p>
                  )}

                  {mockBehavioralLogs.map((log, index) => (
                    <div key={index} className="flex items-start mb-3">
                      <div
                        className={`w-3 h-3 rounded-full mt-1 mr-3 ${
                          log.label === "suspicious"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {log.time} — {log.question} — {log.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          Confidence: {(log.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* RUNTIME LOGS */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Runtime Security Logs</h3>

                  {mockRuntimeLogs.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      No runtime violations detected.
                    </p>
                  )}

                  {mockRuntimeLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border rounded p-3 mb-2 flex justify-between text-sm"
                    >
                      <div>
                        <p className="font-medium">{log.type}</p>
                        <span
                          className={`px-2 py-1 text-xs rounded ${severityColor(
                            log.severity,
                          )}`}
                        >
                          {log.severity}
                        </span>
                      </div>
                      <span className="text-gray-400">{log.time}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
