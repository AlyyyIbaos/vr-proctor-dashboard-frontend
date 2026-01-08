import { Card, CardContent } from "../ui/card";
import AlertItem from "../ui/AlertItem";

export default function LiveMonitoringPanel({ alerts = [] }) {
  return (
    <Card>
      <CardContent className="p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Live Monitoring Alerts
          </h3>

          <span className="text-sm text-gray-500">
            {alerts.length} alert{alerts.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* EMPTY STATE */}
        {alerts.length === 0 && (
          <p className="text-sm text-gray-500">
            No suspicious activity detected yet.
          </p>
        )}

        {/* ALERT LIST */}
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <AlertItem key={index} alert={alert} />
          ))}
        </div>

      </CardContent>
    </Card>
  );
}
