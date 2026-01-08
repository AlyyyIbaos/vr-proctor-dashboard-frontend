import { Card, CardContent } from "./card";

export default function StatCard({ label, value }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-semibold mt-2">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
