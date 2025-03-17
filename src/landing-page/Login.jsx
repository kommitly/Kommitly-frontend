import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://kommitly-backend.onrender.com/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        await login(data.access); // Wait for login process to complete
        navigate("/dashboard/home"); // Redirect after successful login
      } else {
        setMessage(data.error || "Login failed.");
      }
    } catch (error) {
      setMessage("Error logging in. Try again.");
    }
  };

  return (
    <div className="flex items-center h-screen">
      <div className="w-1/2 h-full bg-[#6F2DA8] flex flex-col items-center justify-center">
        <h1 className="text-4xl text-white font-bold mb-4">Welcome to Kommitly</h1>
        <p className="text-white max-w-[300px] text-center">
          Achieve your goals with Kommitly. Break down your big dreams into small, actionable steps. Track your progress, stay accountable, and make success a habit.
        </p>
      </div>

      <div className="flex w-1/2 flex-col h-screen items-center p-4">
        <h2 className="text-3xl font-semibold text-[#6F2DA8]">Login</h2>

        <div className="flex flex-col gap-4 p-4 justify-center h-screen">
          {message && <p>{message}</p>}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" variant="contained" color="secondary" className="cursor-pointer mt-4 rounded-md text-white p-2 w-auto">Login</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;