import { LogOut } from "lucide-react";
import logo from "../../assets/synapsee-logo.png";

export default function StudentLayout({ children }) {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* TOP NAV */}
      <header className="h-16 border-b flex items-center justify-between px-8 bg-white">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="SynapSee Logo"
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-lg font-semibold text-pup-maroon">
            SynapSee Student Portal
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6 text-sm">
          <span
            onClick={() => (window.location.href = "/student/profile")}
            className="text-gray-600 cursor-pointer hover:text-pup-maroon transition"
          >
            Profile
          </span>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-pup-maroon transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="px-8 py-10 bg-gray-50 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
