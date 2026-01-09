export default function AlertItem({ alert }) {
  // ============================
  // NORMALIZE LEGACY + NEW ALERTS
  // ============================
  const eventType =
    alert.event_type ||
    alert.behavior_type ||
    "Unknown Event";

  const details =
    alert.details ||
    alert.description ||
    "No details provided";

  const severity =
    alert.severity || "low";

  const confidenceLevel =
    alert.confidence_level != null
      ? Math.round(alert.confidence_level * 100)
      : alert.confidence != null
        ? alert.confidence
        : 0;

  const detectedAt =
    alert.detected_at ||
    alert.created_at ||
    null;

  const severityStyle = {
    low: "border-green-400 bg-green-50 text-green-700",
    medium: "border-yellow-400 bg-yellow-50 text-yellow-700",
    high: "border-red-400 bg-red-50 text-red-700",
  }[severity] || "border-gray-300";

  return (
    <div className={`border-l-4 p-3 rounded ${severityStyle}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">
            {eventType}
          </p>

          <p className="text-sm">
            {details}
          </p>

          <p className="text-xs mt-1">
            Confidence: {confidenceLevel}%
          </p>
        </div>

        {detectedAt && (
          <span className="text-xs text-gray-500">
            {new Date(detectedAt).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
}
