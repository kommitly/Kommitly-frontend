import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DashboardPage from './dashboard/pages/DashboardPage';
import { Route, Routes, Navigate } from "react-router-dom";
import DashboardLayout from './DashboardLayout';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Home from './dashboard/pages/Home/Home';
import Goal from './dashboard/pages/Goal/Goal';
import Goals from './dashboard/pages/Goals/Goals';


function App() {
 

  return (
    <div className=''>
      <Routes>
 
      <Route
          path="/dashboard/*"
          element= {<DashboardLayout />}
        >
           <Route index element={<DashboardPage />} />
            <Route path="home" element={<Home />} />
            <Route path="goals" element={<Goals />} />
            <Route path="goal/:goalId" element={<Goal />} />

           </Route>

      </Routes>

    </div>
  )
}

export default App
