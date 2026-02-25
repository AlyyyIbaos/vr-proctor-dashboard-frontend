import { useNavigate } from "react-router-dom";
import StudentLayout from "../components/layout/StudentLayout";

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("full_name") || "Student";

  // =========================
  // MOCK UPCOMING EXAM
  // =========================
  const upcomingExam = {
    id: "3",
    exam_name: "Artificial Intelligence Final Exam",
    date: "March 30, 2026",
    status: "Not Started",
  };

  // =========================
  // MOCK COMPLETED EXAMS
  // =========================
  const completedExams = [
    {
      id: "1",
      exam_name: "Computer Networks Final Exam",
      score: 42,
      max_score: 50,
      status: "Completed",
      behavior: "Normal",
    },
    {
      id: "2",
      exam_name: "Data Structures Midterm",
      score: 35,
      max_score: 50,
      status: "Completed",
      behavior: "Cheating",
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
        {/* UPCOMING EXAM SECTION */}
        {/* ========================= */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Upcoming Examination
          </h3>

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
        </div>

        {/* ========================= */}
        {/* COMPLETED EXAMS SECTION */}
        {/* ========================= */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Completed Examinations
          </h3>

          {completedExams.map((session) => (
            <div
              key={session.id}
              className="bg-white border rounded-lg p-6 flex justify-between items-center shadow-sm"
            >
              <div className="space-y-1">
                <h4 className="text-lg font-semibold">{session.exam_name}</h4>

                <p className="text-sm text-gray-500">
                  Score: {session.score} / {session.max_score}
                </p>

                <p className="text-sm text-gray-500">
                  Status: {session.status}
                </p>

                {/* VISUAL BEHAVIOR BADGE */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">Behavior:</span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      session.behavior === "Normal"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {session.behavior.toUpperCase()}
                  </span>
                </div>
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
      </div>
    </StudentLayout>
  );
}
