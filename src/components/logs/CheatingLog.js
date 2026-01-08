import { Card, CardContent } from "../ui/card";
import StatusBadge from "../ui/StatusBadge";

export default function CheatingLog({ logs = [] }) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Behavior Logs</h3>

        {logs.length === 0 && (
          <p className="text-sm text-gray-500">
            No suspicious behavior recorded.
          </p>
        )}

        <ul className="space-y-3 max-h-80 overflow-y-auto">
          {logs.map((log) => (
            <li
              key={log.id}
              className="border rounded p-3 flex flex-col gap-1"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {log.behavior_type}
                </span>
                <StatusBadge status={log.severity} />
              </div>

              <p className="text-sm text-gray-600">
                {log.description}
              </p>

              <div className="text-xs text-gray-500 flex justify-between">
                <span>Confidence: {log.confidence}%</span>
                <span>
                  {new Date(log.detected_at).toLocaleTimeString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
