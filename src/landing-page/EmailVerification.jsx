import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmailVerificationCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerification = async () => {
      const email = localStorage.getItem("email");
      const password = localStorage.getItem("password"); // If stored (optional)

      if (!email || !password) return; // Ensure credentials are stored

      try {
        const response = await fetch("https://kommitly-backend.onrender.com/api/token/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.removeItem("email");
          localStorage.removeItem("password");
          navigate("/dashboard/home"); // Redirect after successful login
        }
      } catch (error) {
        console.error("Error checking verification status", error);
      }
    };

    const interval = setInterval(checkVerification, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [navigate]);
};

export default EmailVerificationCheck;
