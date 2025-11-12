import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./landing-page/ProtectedRoute";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
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
import Settings from "./dashboard/pages/Settings/Settings";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CssVarsProvider } from '@mui/joy/styles';
import Registration from "./landing-page/Registration";
import Schedule from "./dashboard/pages/Schedule/Schedule";
import DailyTemplatesPage from "./dashboard/pages/Templates/DailyTemplatesPage";
import DailyTemplateDetail from "./dashboard/pages/Templates/DailyTemplateDetail";
import DailyActivityHistory from "./dashboard/pages/Templates/DailyActivityHistory";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// Removed duplicate import of DashboardPage
import { Navigate } from "react-router-dom";
// Removed duplicate import of DashboardLayout
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// Removed duplicate import of Home
import Tasks from './dashboard/pages/Tasks/Tasks';
import Taskpage from './dashboard/pages/Task/Task';
import AiSubtaskPage from "./dashboard/pages/AiGoal/AiSubtaskPage";
import Stats from "./dashboard/pages/Analytics/Stats";
import Calendar from "./dashboard/pages/Calendar/Calendar";
import VerifyRedirect from "./landing-page/VerifyRedirect";


function App() {
  const [theme, colorMode] = useMode();
  const muiTheme = useTheme();
  const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down('sm'));

  

  






  return (
   
    <CssVarsProvider>
       <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/registration?tab=signup" element={<Signup />} />
              <Route path="/registration?tab=login" element={<Login />} />
             
           
              <Route path="/verify-email/:token" element={<EmailVerificationCheck />} />
              <Route path="/verify-redirect" element={<VerifyRedirect />} />

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
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/:taskId" element={<Taskpage />} />
                <Route path="ai-goal/:goalId" element={<AiGoal />} />
                <Route path="ai-goal/:goalId/task/:taskId/subtask/:subtaskId" element={<AiSubtaskPage />} />
                <Route path="goal/:goalId" element={<Goal />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="routine" element={<Schedule/>} />
                <Route path="templates" element={<DailyTemplatesPage/>} />
                <Route path="templates/:templateId" element={<DailyTemplateDetail />} />
                <Route path="analytics" element={<Stats />} />
                <Route path="settings" element={<Settings/>} />
                <Route path="templates/suggested/:templateName" element={<DailyTemplateDetail />} />
                <Route path="templates/:templateId/history" element={<DailyActivityHistory />} />


              </Route>
            </Routes>
      </ThemeProvider>
      </ColorModeContext.Provider>

      </CssVarsProvider>
       




       
      
   
  );
}

export default App;
