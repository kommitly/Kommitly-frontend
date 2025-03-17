import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";

const EmailVerificationCheck = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const { token } = useParams();

  useEffect(() => {
    const socket = io(`ws://kommitly-backend.onrender.com/ws/verify/${token}/`);

    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    socket.on("message", (data) => {
      const parsedData = JSON.parse(data);
      if (parsedData.verified) {
        setLoading(false);
        login(token); // Authenticate with the token.
        navigate("/dashboard/home");
      } else {
        setLoading(false);
        setError(parsedData.message);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
      setLoading(false);
      setError("Error connecting to verification server.");
    });

    return () => {
      socket.disconnect();
    };
  }, [token, login, navigate]);

  if (loading) {
    return <div>Verifying Email...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <div>Verification in progress...</div>;
};

export default EmailVerificationCheck;