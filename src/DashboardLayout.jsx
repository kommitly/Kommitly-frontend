import React from 'react'
import { Outlet } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';

const DashboardLayout = () => {
  return (
    <Dashboard >
    <Outlet />
  </Dashboard>
  )
}

export default DashboardLayout