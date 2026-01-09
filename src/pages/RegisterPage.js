import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Student Registration
        </h2>

        <input
          name="email"
          placeholder="Email"
          className="w-full mb-2 px-3 py-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="full_name"
          placeholder="Full Name"
          className="w-full mb-2 px-3 py-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="student_number"
          placeholder="Student Number"
          className="w-full mb-2 px-3 py-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="program"
          placeholder="Program"
          className="w-full mb-2 px-3 py-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="year_level"
          placeholder="Year Level"
          className="w-full mb-4 px-3 py-2 border rounded"
          onChange={handleChange}
        />

        {message && (
          <p className="text-sm text-center mb-3 text-blue-600">
            {message}
          </p>
        )}

        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Register
        </button>

        <p
          className="text-sm text-center mt-4 text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}
