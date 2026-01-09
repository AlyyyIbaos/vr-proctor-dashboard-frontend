import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/synapsee-logo.png";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    full_name: "",
    student_number: "",
    program: "",
    year_level: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded shadow w-full max-w-lg">

        {/* TOP BAR STYLE HEADER */}
        <div className="h-14 border-b flex items-center px-6 gap-3">
          <img src={logo} alt="SynapSee Logo" className="w-8 h-8" />
          <h1 className="text-lg font-semibold text-gray-800">
            Student Registration
          </h1>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-pup-maroon">
            Create Student Account
          </h2>

          <input
            name="email"
            placeholder="Email"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-pup-goldDark"
            onChange={handleChange}
          />
          <input
            name="full_name"
            placeholder="Full Name"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-pup-goldDark"
            onChange={handleChange}
          />
          <input
            name="student_number"
            placeholder="Student Number"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-pup-goldDark"
            onChange={handleChange}
          />
          <input
            name="program"
            placeholder="Program"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-pup-goldDark"
            onChange={handleChange}
          />
          <input
            name="year_level"
            placeholder="Year Level"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-pup-goldDark"
            onChange={handleChange}
          />

          <button
            className="w-full bg-pup-maroon text-white py-2 rounded hover:bg-pup-goldDark transition mt-2"
          >
            Register
          </button>

          <p
            className="text-sm text-center text-pup-maroon cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Back to Login
          </p>
        </div>
      </div>
    </div>
  );
}
