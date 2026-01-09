import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import LiveExamsPage from "./pages/LiveExamsPage";
import ExamineePage from "./pages/ExamineePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/exams" element={<LiveExamsPage />} />
        <Route path="/examinees/:sessionId" element={<ExamineePage />} />
      </Routes>
    </Router>
  );
}

export default App;
