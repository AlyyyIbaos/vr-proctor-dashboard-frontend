import { useMemo, useState } from "react";
import StudentLayout from "../components/layout/StudentLayout";

/* ================= MOCK DATA ================= */

const mockStudents = [
  { id: "1", name: "Alyssa", prob_cheat: 0.18, status: "Active" },
  { id: "2", name: "John Reyes", prob_cheat: 0.32, status: "Active" },
  { id: "3", name: "Maria Santos", prob_cheat: 0.91, status: "Flagged" },
];

const mockBehaviorLogs = [
  { id: 1, type: "object injection", confidence: "100%", time: "6:17 PM" },
  { id: 2, type: "object injection", confidence: "100%", time: "5:58 PM" },
];

const mockExamSessions = [
  {
    id: "exam1",
    title: "Midterm Exam",
    students: [
      { name: "Student A", status: "active" },
      { name: "Student B", status: "completed" },
    ],
  },
];

/* ================= COMPONENT ================= */

export default function ProctorDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  const classifyRisk = (prob) => {
    if (prob > 0.8) return "High";
    if (prob > 0.5) return "Medium";
    return "Low";
  };

  const sortedStudents = useMemo(() => {
    return [...mockStudents].sort((a, b) => b.prob_cheat - a.prob_cheat);
  }, []);

  const high = sortedStudents.filter(
    (s) => classifyRisk(s.prob_cheat) === "High",
  ).length;

  const avgRisk =
    sortedStudents.reduce((acc, s) => acc + s.prob_cheat, 0) /
    sortedStudents.length;

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* ================= TAB HEADER ================= */}
        <div className="flex space-x-6 border-b pb-3">
          {["overview", "examinee", "sessions"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedStudent(null);
                setSelectedExam(null);
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

        {/* ================= OVERVIEW TAB ================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white shadow rounded p-4">
                <p className="text-sm text-gray-500">Active Examinees</p>
                <p className="text-2xl font-bold">{sortedStudents.length}</p>
              </div>

              <div className="bg-white shadow rounded p-4">
                <p className="text-sm text-gray-500">Flagged Sessions</p>
                <p className="text-2xl font-bold text-red-600">{high}</p>
              </div>

              <div className="bg-white shadow rounded p-4">
                <p className="text-sm text-gray-500">Average Risk Score</p>
                <p className="text-2xl font-bold">
                  {(avgRisk * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            <div className="bg-white shadow rounded p-6">
              <h3 className="font-semibold mb-3">Live Cheating Alerts</h3>
              <p className="text-gray-500 text-sm">No alerts detected yet.</p>
            </div>

            <div className="bg-white shadow rounded p-6">
              <h3 className="font-semibold mb-3">Behavior Logs</h3>

              {mockBehaviorLogs.map((log) => (
                <div
                  key={log.id}
                  className="border rounded p-3 mb-2 text-sm flex justify-between"
                >
                  <div>
                    <p className="font-medium">{log.type}</p>
                    <p className="text-gray-500 text-xs">
                      Confidence: {log.confidence}
                    </p>
                  </div>
                  <span className="text-gray-400 text-xs">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= EXAMINEE TAB ================= */}
        {activeTab === "examinee" && (
          <div className="grid grid-cols-4 gap-6">
            {/* LEFT LIST */}
            <div className="col-span-1 bg-white shadow rounded p-4">
              <h3 className="font-semibold mb-4">Examinees</h3>

              {sortedStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`border rounded p-3 mb-3 cursor-pointer hover:shadow ${
                    selectedStudent?.id === student.id ? "bg-gray-100" : ""
                  }`}
                >
                  <p className="font-medium">{student.name}</p>
                  <p className="text-xs text-gray-500">
                    {(student.prob_cheat * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>

            {/* RIGHT DETAILS */}
            <div className="col-span-3 bg-white shadow rounded p-6">
              {!selectedStudent && (
                <p className="text-gray-500">
                  Select an examinee to inspect session details.
                </p>
              )}

              {selectedStudent && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedStudent.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Risk Level: {classifyRisk(selectedStudent.prob_cheat)}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">
                      Live Monitoring Alerts
                    </h3>

                    {mockBehaviorLogs.map((log) => (
                      <div
                        key={log.id}
                        className="border rounded p-3 mb-2 text-sm"
                      >
                        {log.type}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= EXAM SESSION TAB ================= */}
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

            {selectedExam && (
              <>
                <button
                  onClick={() => setSelectedExam(null)}
                  className="text-sm text-gray-500 mb-4"
                >
                  ← Back
                </button>

                <h3 className="font-semibold mb-4">{selectedExam.title}</h3>

                {selectedExam.students.map((student, index) => (
                  <div
                    key={index}
                    className="border rounded p-3 mb-2 flex justify-between"
                  >
                    <span>{student.name}</span>
                    <span className="text-sm text-gray-500 capitalize">
                      {student.status}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
