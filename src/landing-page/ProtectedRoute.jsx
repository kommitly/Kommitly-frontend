import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (<div className='w-full mt-8 flex min-h-screen'>
          <div className="w-11/12 p-8 mt-8 py-8 flex-1 flex justify-center items-center overflow-y-auto scrollbar-hide max-h-[75vh] no-scrollbar">
          <motion.div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-[#65558F] rounded-full"
          initial={{ y: -10 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }}
        />
      ))}
    </motion.div>
    
          </div>
        </div>); // Show loading indicator
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;