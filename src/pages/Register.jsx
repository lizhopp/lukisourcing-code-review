import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.js";
import RegisterForm from "../components/RegisterForm.jsx";

export default function Register({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleRegister(formData) {
    setError("");

    try {
      const data = await registerUser(formData);
      onAuthSuccess(data);
      navigate("/");
    } catch (networkError) {
      console.error(networkError);
      setError(networkError.message || "Unable to reach the server right now.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <p className="eyebrow">Create Account</p>
        <h1>Start your sourcing workspace</h1>
        <p>Create your user with the basic details your app needs first.</p>

        <RegisterForm onSubmit={handleRegister} errorMessage={error} />

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in here.</Link>
        </p>
      </div>
    </div>
  );
}
