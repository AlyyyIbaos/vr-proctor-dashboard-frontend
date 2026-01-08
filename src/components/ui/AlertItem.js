export default function AlertItem({ alert }) {
  const {
    behavior_type,
    description,
    confidence,
    severity,
    detected_at,
  } = alert;

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
            {behavior_type}
          </p>

          <p className="text-sm">
            {description}
          </p>

          <p className="text-xs mt-1">
            Confidence: {confidence}%
          </p>
        </div>

        {detected_at && (
          <span className="text-xs text-gray-500">
            {new Date(detected_at).toLocaleTimeString()}
          </span>
        )}

      </div>
    </div>
  );
}
