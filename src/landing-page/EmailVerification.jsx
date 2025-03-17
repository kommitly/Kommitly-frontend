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
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = io("https://kommitly-backend.onrender.com", {
      query: { token: token },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("WebSocket connected");
    });

    newSocket.on("verification_status", (data) => {
      if (data.verified) {
        setLoading(false);
        login(data.token); // Assuming backend sends a new token
        navigate("/dashboard/home");
      } else {
        setLoading(false);
        setError("Verification failed.");
      }
    });

    newSocket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
      setLoading(false);
      setError("Error connecting to verification server.");
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
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