import { useNavigate } from "react-router-dom";
import StudentLayout from "../layout/StudentLayout";

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("full_name") || "Student";

  // MOCK EXAM SESSIONS
  const mockSessions = [
    {
      id: "1",
      exam_name: "Computer Networks Final Exam",
      score: 42,
      max_score: 50,
      status: "Completed",
    },
    {
      id: "2",
      exam_name: "Data Structures Midterm",
      score: 35,
      max_score: 50,
      status: "Completed",
    },
  ];

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-pup-maroon">
            Welcome, {fullName}
          </h2>
          <p className="text-gray-600 mt-2">
            Below are your completed examination sessions.
          </p>
        </div>

        <div className="space-y-4">
          {mockSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white border rounded-lg p-6 flex justify-between items-center shadow-sm"
            >
              <div>
                <h3 className="text-lg font-semibold">{session.exam_name}</h3>
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
                className="bg-pup-maroon text-white px-4 py-2 rounded hover:bg-pup-goldDark transition"
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
