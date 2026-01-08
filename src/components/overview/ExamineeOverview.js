import { Card, CardContent } from "../ui/card";
import StatusBadge from "../ui/StatusBadge";

export default function ExamineeOverview({ session }) {
  if (!session) return null;

  const {
    examinee_name,
    exam_title,
    status,
    riskLevel,
    score,
    max_score,
  } = session;

  return (
    <Card>
      <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* LEFT: Examinee Info */}
        <div>
          <h2 className="text-xl font-semibold">
            {examinee_name}
          </h2>

          <p className="text-sm text-gray-500">
            Exam: {exam_title || "—"}
          </p>

          <div className="mt-2">
            <StatusBadge status={status} />

            {/* SCORE DISPLAY */}
            {status === "completed" && score !== null ? (
              <span className="text-sm font-semibold text-gray-700">
                Score: {score}/{max_score}
              </span>
            ) : (
              <span className="text-sm text-gray-400 italic">
                Score not available
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: Risk Level */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Risk Level
          </span>
          <StatusBadge status={riskLevel} />
        </div>

      </CardContent>
    </Card>
  );
}
