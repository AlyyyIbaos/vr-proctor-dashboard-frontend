import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    } catch (err) {
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

      // Store exam session token
      localStorage.setItem("exam_token", data.token);

      setMessage("Login successful");
      navigate("/dashboard");
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Student Login
        </h2>

        <input
          className="w-full mb-3 px-3 py-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {step === "verify" && (
          <input
            className="w-full mb-3 px-3 py-2 border rounded"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}

        {message && (
          <p className="text-sm text-center mb-3 text-blue-600">
            {message}
          </p>
        )}

        {step === "request" ? (
          <button
            onClick={requestOtp}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Send OTP
          </button>
        ) : (
          <button
            onClick={verifyOtp}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Verify & Login
          </button>
        )}

        <p
          className="text-sm text-center mt-4 text-blue-600 cursor-pointer"
          onClick={() => navigate("/register")}
        >
          New student? Register here
        </p>
      </div>
    </div>
  );
}
