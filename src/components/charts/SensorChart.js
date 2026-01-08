export default function SensorChart({ title }) {
  return (
    <div className="bg-white p-4 rounded border">
      <h3 className="font-medium mb-2">{title}</h3>
      <div className="h-32 flex items-center justify-center text-gray-400">
        Sensor Data
      </div>
    </div>
  );
}
