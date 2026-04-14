import { useState } from "react";

const initialForm = {
  first_name: "",
  last_name: "",
  company: "",
  email: "",
  password: "",
};

export default function RegisterForm({ onSubmit, errorMessage }) {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form auth-grid" onSubmit={handleSubmit}>
      <label>
        <span>First Name</span>
        <input
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="Lucas"
          required
        />
      </label>

      <label>
        <span>Last Name</span>
        <input
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Montenegro"
          required
        />
      </label>

      <label className="full-width">
        <span>Company</span>
        <input
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Luki Sourcing"
          required
        />
      </label>

      <label className="full-width">
        <span>Email</span>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@company.com"
          required
        />
      </label>

      <label className="full-width">
        <span>Password</span>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          required
        />
      </label>

      {errorMessage ? <p className="form-error full-width">{errorMessage}</p> : null}

      <button className="button primary auth-submit full-width" disabled={submitting}>
        {submitting ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
