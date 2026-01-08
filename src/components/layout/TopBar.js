import { Bell, User, LogOut, Settings } from "lucide-react";

export default function TopBar({ alertCount = 0, onAlertClick }) {
  
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="h-14 w-full bg-white border-b flex items-center justify-between px-6">
      
      {/* LEFT */}
      <h1 className="text-lg font-semibold text-gray-800">
        VR Proctor Dashboard
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-6">

        {/* NOTIFICATIONS */}
        <div className="relative cursor-pointer" onClick={onAlertClick}>
          <Bell className="w-5 h-5 text-gray-600" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
              {alertCount}
            </span>
          )}
        </div>

        {/* SETTINGS */}
        <Settings className="w-5 h-5 text-gray-600 cursor-pointer" />

        {/* USER */}
        <div className="relative group cursor-pointer">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">Proctor</span>
        </div>

        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow hidden group-hover:block">
            <p className="px-4 py-2 text-sm hover:bg-gray-100">Profile</p>
            <p className="px-4 py-2 text-sm hover:bg-gray-100">Settings</p>
        </div>
          </div>

        {/* LOGOUT */}
        <LogOut className="w-5 h-5 text-gray-600 cursor-pointer" 
        onClick={handleLogout}/>
        
      </div>
    </div>
  );
}
