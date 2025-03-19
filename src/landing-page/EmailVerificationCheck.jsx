import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext'; // Adjust path as needed

const EmailVerificationCheck = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const { token } = useParams();

  console.log("Token received:", token);

  useEffect(() => {
    if (!token) {
      setError("Verification token missing.");
      setLoading(false);
      return;
    }

    const socket = new WebSocket(`wss://kommitly-backend.onrender.com/ws/verify/${token}/`);


    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    socket.on("message", (data) => {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.verified) {
          setLoading(false);
          login(parsedData.auth_token); // Use actual auth token
          navigate("/dashboard/home");
        } else {
          setLoading(false);
          setError(parsedData.message);
        }
      } catch (e) {
        console.error("Error parsing verification data:", e);
        setLoading(false);
        setError("Invalid verification response.");
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