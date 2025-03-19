import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    timezone: "Africa/Nairobi",
  });
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://kommitly-backend.onrender.com/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setDialogOpen(true); // Open the dialog
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Signup failed. Try again.");
      }
    } catch (error) {
      setMessage("Error signing up. Please try again.");
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

      <div className="flex w-1/2 justify-center flex-col items-center">
        <h2 className="text-2xl font-bold">Sign Up</h2>
        {message && <p className="text-red-500">{message}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" name="first_name" placeholder="First Name"  value={formData.first_name} onChange={handleChange} required />
          <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit" className="bg-[#6F2DA8] text-white px-4 py-2 rounded">Sign Up</button>
        </form>

        {dialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md">
              <p>Signup successful! Please check your email to verify your account.</p>
             
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;