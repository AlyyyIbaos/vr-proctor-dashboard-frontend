import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

const severityColor = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

const LiveAlertPanel = ({ alerts }) => {
  return (
    <Card className="w-full">
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">
          🚨 Live Cheating Alerts
        </h2>

        {alerts.length === 0 ? (
          <p className="text-sm text-gray-500">
            No alerts detected yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {alerts.map((alert, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {alert.behavior_type}
                  </p>
                  <p className="text-xs text-gray-500">
                    {alert.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    Confidence: {alert.confidence}%
                  </p>
                </div>

                <Badge className={severityColor[alert.severity]}>
                  {alert.severity.toUpperCase()}
                </Badge>
              </li>
            ))}
          </ul>
        )}
        
      </CardContent>
    </Card>
    
  );
};

export default LiveAlertPanel;
