import { useNavigate } from "react-router-dom";
import { useState } from "react";
import StudentLayout from "../components/layout/StudentLayout";

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("full_name") || "Student";

  const [activeTab, setActiveTab] = useState("upcoming");

  // =========================
  // MOCK UPCOMING EXAM
  // =========================
  const upcomingExam = {
    id: "3",
    exam_name: "Pre-Test",
    date: "February 20, 2026",
    status: "Not Started",
  };

  // =========================
  // MOCK COMPLETED EXAMS
  // =========================
  const completedExams = [
    {
      id: "d4868390-a11c-4a78-b833-27fd2c606c06",
      exam_name: "Pre-Test",
      score: 3,
      max_score: 5,
      status: "Completed",
    },
  ];

  const handleStartExam = () => {
    alert("Exam session initialized. Launch your VR device.");
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-10">
        {/* WELCOME */}
        <div>
          <h2 className="text-3xl font-bold text-pup-maroon">
            Welcome, {fullName}
          </h2>
          <p className="text-gray-600 mt-2">
            Manage your examinations and monitoring reports.
          </p>
        </div>

        {/* ========================= */}
        {/* TAB HEADER */}
        {/* ========================= */}
        <div className="flex gap-8 border-b text-lg font-semibold">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-2 ${
              activeTab === "upcoming"
                ? "border-b-2 border-pup-maroon text-pup-maroon"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Upcoming
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-2 ${
              activeTab === "completed"
                ? "border-b-2 border-pup-maroon text-pup-maroon"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Completed
          </button>
        </div>

        {/* ========================= */}
        {/* UPCOMING TAB CONTENT */}
        {/* ========================= */}
        {activeTab === "upcoming" && (
          <div className="bg-white border rounded-lg p-6 flex justify-between items-center shadow-sm">
            <div>
              <h4 className="text-lg font-semibold">
                {upcomingExam.exam_name}
              </h4>
              <p className="text-sm text-gray-500">
                Scheduled Date: {upcomingExam.date}
              </p>
              <p className="text-sm text-gray-500">
                Status: {upcomingExam.status}
              </p>
            </div>

            <button
              onClick={handleStartExam}
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
            >
              Start Exam
            </button>
          </div>
        )}

        {/* ========================= */}
        {/* COMPLETED TAB CONTENT */}
        {/* ========================= */}
        {activeTab === "completed" && (
          <div className="space-y-4">
            {completedExams.map((session) => (
              <div
                key={session.id}
                className="bg-white border rounded-lg p-6 flex justify-between items-center shadow-sm"
              >
                <div>
                  <h4 className="text-lg font-semibold">{session.exam_name}</h4>
                  <p className="text-sm text-gray-500">
                    Score: {session.score} / {session.max_score}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {session.status}
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(`/student/report/${session.id}?tab=academic`)
                  }
                  className="bg-pup-maroon text-white px-5 py-2 rounded hover:bg-pup-goldDark transition"
                >
                  View Report
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
