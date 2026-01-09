import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/synapsee-logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const requestOtp = () => {
    // DEMO MODE: go straight to student panel
    navigate("/student");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded shadow w-full max-w-md">

        {/* TOP BAR STYLE HEADER */}
        <div className="h-14 border-b flex items-center px-6 gap-3">
          <img src={logo} alt="SynapSee Logo" className="w-8 h-8" />
          <h1 className="text-lg font-semibold text-gray-800">
            Student Authentication
          </h1>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-pup-maroon">
            Student Login
          </h2>

          <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pup-goldDark"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={requestOtp}
            className="w-full bg-pup-maroon text-white py-2 rounded hover:bg-pup-goldDark transition"
          >
            Send OTP
          </button>

          <p
            className="text-sm text-center text-pup-maroon cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            New student? Register here
          </p>
        </div>
      </div>
    </div>
  );
}
