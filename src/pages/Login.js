import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/synapsee-logo.png";

const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("request"); // request | verify
  const [message, setMessage] = useState("");

  const requestOtp = async () => {
    setMessage("Sending OTP...");
    try {
      const res = await fetch(`${API_URL}/api/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to send OTP");
        return;
      }

      setMessage("OTP sent to your email");
      setStep("verify");
    } catch {
      setMessage("Server error");
    }
  };

  const verifyOtp = async () => {
    setMessage("Verifying OTP...");
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Invalid OTP");
        return;
      }

      localStorage.setItem("exam_token", data.token);
      navigate("/dashboard");
    } catch {
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pup.maroon">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <div className="flex flex-col items-center mb-4">
          <img
            src={logo}
            alt="Synapsee Logo"
            className="h-14 mb-2"
          />
          <h2 className="text-lg font-semibold text-pup.maroon">
            Student Login
          </h2>
        </div>

        <input
          className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pup.goldDark"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {step === "verify" && (
          <input
            className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pup.goldDark"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}

        {message && (
          <p className="text-sm text-center mb-3 text-gray-600">
            {message}
          </p>
        )}

        {step === "request" ? (
          <button
            onClick={requestOtp}
            className="w-full bg-pup.maroon text-white py-2 rounded hover:bg-pup.goldDark transition"
          >
            Send OTP
          </button>
        ) : (
          <button
            onClick={verifyOtp}
            className="w-full bg-pup.goldDark text-white py-2 rounded hover:bg-pup.goldLight transition"
          >
            Verify & Login
          </button>
        )}

        <p
          className="text-sm text-center mt-4 text-pup.maroon cursor-pointer hover:underline"
          onClick={() => navigate("/register")}
        >
          New student? Register here
        </p>
      </div>
    </div>
  );
}
