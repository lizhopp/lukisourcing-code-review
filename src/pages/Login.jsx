import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.js";
import LoginForm from "../components/LoginForm.jsx";

export default function Login({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleLogin(formData) {
    setError("");

    try {
      const data = await loginUser(formData);
      onAuthSuccess(data);
      navigate("/");
    } catch (networkError) {
      console.error(networkError);
      setError(networkError.message || "Unable to reach the server right now.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Welcome Back</p>
        <h1>Log in to LukiSourcing</h1>
        <p>Use your email and password to enter your sourcing workspace.</p>

        <LoginForm onSubmit={handleLogin} errorMessage={error} />

        <p className="auth-switch">
          Need an account? <Link to="/register">Create one here.</Link>
        </p>
      </div>
    </div>
  );
}
