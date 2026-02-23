import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../components/layout/StudentLayout";
import { Card, CardContent } from "../components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/table";

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================
  // FETCH ACTIVE SESSIONS (REAL DATA)
  // =====================================
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/sessions/active`,
          {
            credentials: "include",
          },
        );

        if (!res.ok) throw new Error("Failed to fetch sessions");

        const data = await res.json();
        setSessions(data || []);
      } catch (err) {
        console.error("STUDENT DASHBOARD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // =====================================
  // DERIVED VALUES
  // =====================================
  const latestSession = sessions.length > 0 ? sessions[0] : null;

  const latestScore =
    latestSession && latestSession.score != null
      ? `${latestSession.score}/${latestSession.max_score}`
      : "—";

  const latestStatus = latestSession?.status ?? "No Active Session";
  const latestRisk = latestSession?.risk_level ?? "low";

  if (loading) {
    return (
      <StudentLayout>
        <p className="text-gray-500">Loading dashboard...</p>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      {/* ================= HERO ================= */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-pup-maroon mb-3">
          Your Exam & Monitoring Overview
        </h1>

        <p className="text-gray-600 max-w-3xl">
          SynapSee ensures fair and secure virtual examinations through
          AI-powered behavioral analysis and runtime integrity monitoring. Below
          is your academic and monitoring summary.
        </p>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Academic */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500 mb-2">Academic Summary</h3>

            <p className="text-xl font-semibold text-pup-maroon">
              {latestScore}
            </p>

            <p className="text-sm text-gray-600 mt-2">Status: {latestStatus}</p>
          </CardContent>
        </Card>

        {/* Behavioral */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500 mb-2">
              Behavioral Monitoring
            </h3>

            <p className="text-xl font-semibold text-pup-maroon">
              Risk Level: {latestRisk}
            </p>

            <p className="text-sm text-gray-600 mt-2">
              Based on CNN–LSTM + CAT aggregation
            </p>
          </CardContent>
        </Card>

        {/* Runtime */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500 mb-2">Runtime Security</h3>

            <p className="text-xl font-semibold text-pup-maroon">
              Integrity Monitoring Active
            </p>

            <p className="text-sm text-gray-600 mt-2">
              Object & Scene Validation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ================= TABS ================= */}
      <div className="mb-6 border-b flex gap-8 text-sm font-medium">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 ${
            activeTab === "overview"
              ? "border-b-2 border-pup-maroon text-pup-maroon"
              : "text-gray-500 hover:text-pup-maroon"
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 ${
            activeTab === "history"
              ? "border-b-2 border-pup-maroon text-pup-maroon"
              : "text-gray-500 hover:text-pup-maroon"
          }`}
        >
          Exam History
        </button>
      </div>

      {/* ================= TAB CONTENT ================= */}
      {activeTab === "overview" && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Active Sessions</h2>

            {sessions.length === 0 && (
              <p className="text-gray-500">No active sessions found.</p>
            )}

            {sessions.map((session) => (
              <div
                key={session.id}
                className="border rounded-lg p-4 mb-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {session.exams?.title ?? "Exam"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Started: {new Date(session.started_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Risk Level: {session.risk_level}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/student/session/${session.id}`)}
                  className="text-pup-maroon hover:underline text-sm"
                >
                  View Report
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === "history" && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-6">Exam History</h2>

            {sessions.length === 0 ? (
              <p className="text-gray-500">No exam history available.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.exams?.title ?? "Exam"}</TableCell>
                      <TableCell>{session.status}</TableCell>
                      <TableCell>{session.risk_level}</TableCell>
                      <TableCell>
                        {new Date(session.started_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() =>
                            navigate(`/student/session/${session.id}`)
                          }
                          className="text-pup-maroon hover:underline text-sm"
                        >
                          View Report
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </StudentLayout>
  );
}
