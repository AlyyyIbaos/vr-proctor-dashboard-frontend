import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import logo from "../assets/synapsee-logo.png";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===============================
  // REQUEST OTP
  // ===============================
  const requestOtp = async () => {
    try {
      setLoading(true);
      setError("");

      await api.post("/auth/request-otp", { email });

      setOtpSent(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // VERIFY OTP
  // ===============================
  const verifyOtp = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      const data = response.data;

      // 🔐 SAVE TOKEN
      localStorage.setItem("exam_token", data.token);
      localStorage.setItem("user_role", data.role);
      localStorage.setItem("full_name", data.full_name);

      // 🚀 ROLE-BASED REDIRECT
      if (data.role === "proctor") {
        navigate("/proctor");
      } else {
        navigate("/student");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // DEV LOGIN (TEMPORARY BYPASS)
  // ===============================
  const devLogin = () => {
    localStorage.setItem("exam_token", "dev-token");
    localStorage.setItem("user_role", "student");
    localStorage.setItem("full_name", "Alyssa");
    localStorage.setItem("email", "alyssa@example.com");
    localStorage.setItem("student_number", "2023-00123");
    localStorage.setItem("program", "BS Electronics Engineering");
    localStorage.setItem("year_level", "3");

    navigate("/student");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded shadow w-full max-w-md">
        {/* HEADER */}
        <div className="h-14 border-b flex items-center px-6 gap-3">
          <img src={logo} alt="SynapSee Logo" className="w-8 h-8" />
          <h1 className="text-lg font-semibold text-gray-800">
            SynapSee Authentication
          </h1>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-pup-maroon">Login</h2>

          {/* EMAIL INPUT */}
          <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pup-goldDark"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={otpSent}
          />

          {/* SEND OTP BUTTON */}
          {!otpSent && (
            <button
              onClick={requestOtp}
              disabled={loading || !email}
              className="w-full bg-pup-maroon text-white py-2 rounded hover:bg-pup-goldDark transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          )}

          {/* OTP INPUT */}
          {otpSent && (
            <>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pup-goldDark"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                onClick={verifyOtp}
                disabled={loading || !otp}
                className="w-full bg-pup-maroon text-white py-2 rounded hover:bg-pup-goldDark transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {/* ERROR */}
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          {/* REGISTER LINK */}
          <p
            className="text-sm text-center text-pup-maroon cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            New student? Register here
          </p>

          {/* DEV BYPASS LOGIN */}
          <button
            onClick={devLogin}
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-black transition mt-3"
          >
            Dev Login (Bypass OTP)
          </button>
          {/* TEMP PROCTOR PORTAL ACCESS */}
          <button
            onClick={() => {
              localStorage.setItem("exam_token", "dev-proctor-token");
              localStorage.setItem("user_role", "proctor");
              localStorage.setItem("full_name", "Proctor Admin");
              navigate("/proctor");
            }}
            className="w-full bg-indigo-700 text-white py-2 rounded hover:bg-indigo-800 transition mt-2"
          >
            Open SynapSee Proctor Portal (Temp)
          </button>
        </div>
      </div>
    </div>
  );
}
