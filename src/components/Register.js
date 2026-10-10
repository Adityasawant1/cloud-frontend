import { useState } from "react";
import { registerUser } from "../api/AuthService";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../api/ToastService";

export default function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (data.name.trim().length < 3) {
      toastError("Name must be at least 3 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toastError("Please enter a valid email address");
      return false;
    }

    if (data.password.length < 6) {
      toastError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await registerUser(data);
      toastSuccess("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toastError(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="auth">
      <form onSubmit={submit}>
        <h2>Register</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={onChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={onChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={onChange}
          required
        />

        <button type="submit">Register</button>

        <div className="auth-link">
          Already have an account? <a href="/login">Login</a>
        </div>
      </form>
    </div>
  );
}
