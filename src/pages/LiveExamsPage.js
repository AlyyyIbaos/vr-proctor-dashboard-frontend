import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function LiveExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/exams/live`)
      .then(res => res.json())
      .then(data => {
        console.log("LIVE EXAMS RESPONSE:", data);
        setExams(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("FETCH ERROR:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Live Exams">
        <p className="p-6">Loading live exams...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Live Exams">
      <div className="p-6 space-y-6">

        {exams.length === 0 && (
          <p className="text-gray-500">
            No active exams right now.
          </p>
        )}

        {exams.map(exam => (
          <div
            key={exam.id}
            className="bg-white border rounded-lg p-4"
          >
            <h2 className="font-semibold text-lg">
              {exam.title}
            </h2>

            <p className="text-sm text-gray-500 mb-3">
              Active Examinees: {exam.sessions.length}
            </p>

            <div className="space-y-2">
              {exam.sessions.map(session => (
                <div
                  key={session.id}
                  className="flex justify-between items-center border p-2 rounded cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    navigate(`/examinees/${session.id}`)
                  }
                >
                  <span>{session.examinee_name}</span>
                  <span className="text-sm text-gray-600">
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </DashboardLayout>
  );
}
