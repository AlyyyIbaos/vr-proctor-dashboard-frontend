export default function StatusBadge({ status }) {
  if (!status) return null;

  const statusStyle = {
    live: "bg-green-100 text-green-700",
    flagged: "bg-red-100 text-red-700",
    completed: "bg-gray-200 text-gray-700",
    Low: "bg-pup-goldLight text-black",
    Medium: "bg-pup-goldDark text-black",
    High: "bg-pup-maroon text-pup-white",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        statusStyle[status] || "bg-gray-200 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
