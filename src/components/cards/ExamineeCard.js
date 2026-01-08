import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export default function ExamineeCard({ name, status, risk }) {
  const statusColor =
    status === "High Risk"
      ? "destructive"
      : status === "Warning"
      ? "secondary"
      : "default";

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <h3 className="font-medium">{name}</h3>

        <div className="flex justify-between items-center text-sm">
          <span>Status</span>
          <Badge variant={statusColor}>{status}</Badge>
        </div>

        <div className="flex justify-between text-sm">
          <span>Risk Score</span>
          <span className="font-semibold">{risk}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
