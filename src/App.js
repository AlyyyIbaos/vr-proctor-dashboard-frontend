import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import StudentReportPage from "./pages/StudentReportPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import ProctorDashboardPage from "./pages/ProctorDashboardPage";
import ProctorSessionLivePage from "./pages/ProctorSessionLivePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* STUDENT ROUTES */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/report/:sessionId"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentReportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />

        {/* PROCTOR ROUTES */}
        <Route
          path="/proctor"
          element={
            <ProtectedRoute allowedRole="proctor">
              <ProctorDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proctor/session/:sessionId"
          element={
            <ProtectedRoute allowedRole="proctor">
              <ProctorSessionLivePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
