import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/synapsee-logo.png";

const API_URL = process.env.REACT_APP_API_URL;

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    full_name: "",
    student_number: "",
    program: "",
    year_level: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setMessage("Registering...");
    try {
      const res = await fetch(`${API_URL}/api/auth/register-student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Registration failed");
        return;
      }

      setMessage("Registration successful");
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pup-maroon">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex flex-col items-center mb-4">
          <img
            src={logo}
            alt="Synapsee Logo"
            className="h-14 mb-2"
          />
          <h2 className="text-lg font-semibold text-pup-maroon">
            Student Registration
          </h2>
        </div>

        <input
          name="email"
          placeholder="Email"
          className="w-full mb-2 px-3 py-2 border rounded focus:ring-2 focus:ring-pup-goldDark"
          onChange={handleChange}
        />
        <input
          name="full_name"
          placeholder="Full Name"
          className="w-full mb-2 px-3 py-2 border rounded focus:ring-2 focus:ring-pup-goldDark"
          onChange={handleChange}
        />
        <input
          name="student_number"
          placeholder="Student Number"
          className="w-full mb-2 px-3 py-2 border rounded focus:ring-2 focus:ring-pup-goldDark"
          onChange={handleChange}
        />
        <input
          name="program"
          placeholder="Program"
          className="w-full mb-2 px-3 py-2 border rounded focus:ring-2 focus:ring-pup-goldDark"
          onChange={handleChange}
        />
        <input
          name="year_level"
          placeholder="Year Level"
          className="w-full mb-4 px-3 py-2 border rounded focus:ring-2 focus:ring-pup-goldDark"
          onChange={handleChange}
        />

        {message && (
          <p className="text-sm text-center mb-3 text-gray-600">
            {message}
          </p>
        )}

        <button
          onClick={submit}
          className="w-full bg-pup-maroon text-white py-2 rounded hover:bg-pup-goldDark transition"
        >
          Register
        </button>

        <p
          className="text-sm text-center mt-4 text-pup.maroon cursor-pointer hover:underline"
          onClick={() => navigate("/")}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}
