import { useState } from "react";
import { loginUser } from "../api/AuthService";
import { toastError} from "../api/ToastService"
import { useNavigate } from "react-router-dom";

export default function Login({setIsAuthenticated}) {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const onChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submit = async e => {
    e.preventDefault();
    try {
      await loginUser(data);          // API call
      setIsAuthenticated(true); 
           
      navigate("/contacts");          // redirect
    } catch (error) {
      // 👇 Handle invalid credentials
      const message =
        error.response?.data?.message ||
        "Invalid email or password";

      toastError(message);
    }
  };

 return (
  <div className="auth">
    <form onSubmit={submit}>
      <h2>Login</h2>

      <input
        name="email"
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

      <button type="submit">Login</button>

      <div className="auth-link">
        Don’t have an account? <a href="/register">Register</a>
      </div>
    </form>
  </div>
);

}
