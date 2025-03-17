import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./landing-page/ProtectedRoute";
import DashboardLayout from "./DashboardLayout";
import DashboardPage from "./dashboard/pages/DashboardPage";
import Home from "./dashboard/pages/Home/Home";
import AiGoal from "./dashboard/pages/AiGoal/AiGoal";
import Goals from "./dashboard/pages/Goals/Goals";
import Goal from "./dashboard/pages/Goal/Goal";
import LandingPage from "./landing-page/LandingPage";
import Signup from "./landing-page/Signup";
import EmailVerificationCheck from "./landing-page/EmailVerificationCheck";
import Login from "./landing-page/Login";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email/:token" element={<EmailVerificationCheck />} />

        {/* ✅ Correct way to wrap ProtectedRoute */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="home" element={<Home />} />
          <Route path="goals" element={<Goals />} />
          <Route path="ai-goal/:goalId" element={<AiGoal />} />
          <Route path="goal/:goalId" element={<Goal />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
