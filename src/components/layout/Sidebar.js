import logo from "../../assets/synapsee-logo.png";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-pup-maroon text-pup-white">
      <div className="p-6 flex items-center gap-3">
        <img
            src={logo}
            alt="SynapSee Logo"
            className="w-10 h-10 object-contain"
        />
        <span className= "text-xl font-bold">
          SynapSee
        </span>
      </div>

      <nav className="flex flex-col gap-2 px-4">

        <Link
          to="/dashboard"
          className="px-4 py-2 rounded hover:bg-pup-goldDark hover:text-black"
        >
          Dashboard
        </Link>

        <Link
          to="/exams"
          className="px-4 py-2 rounded hover:bg-pup-goldDark hover:text-black"
        >
          Live Exams
        </Link>

        <Link
          to="/exams"
          className="px-4 py-2 rounded hover:bg-pup-goldDark hover:text-black"
        >
          Examinees Monitoring
        </Link>

      </nav>
    </aside>
  );
}
