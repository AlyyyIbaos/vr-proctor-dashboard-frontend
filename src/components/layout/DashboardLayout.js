import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function DashboardLayout({ children, alertCount, onAlertClick }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TopBar alertCount={alertCount} 
        onAlertClick={onAlertClick}/>

        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
