import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./shared/Sidebar/Sidebar";
import Navbar from "./shared/Navbar/Navbar";

const Dashboard = () => {
  return (
    <div className="flex h-screen relative">
      {/* Sidebar (Fixed on the left) */}
      <aside className=" md:w-64 lg:w-60 xl:w-56 2xl:w-66  text-white fixed inset-y-0 transform translate-x-0 transition-transform duration-200 ease-in-out md:relative md:translate-x-0">
        <Sidebar />
      </aside>

    

        {/* Push Outlet Content Below Navbar */}
        <main className="flex-1 w-full ">
          <Navbar className="fixed" />
            <Outlet  />
          </main>
    
    </div>
  );
};

export default Dashboard;
