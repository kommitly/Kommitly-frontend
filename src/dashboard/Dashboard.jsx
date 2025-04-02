import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./shared/Sidebar/Sidebar";
import Navbar from "./shared/Navbar/Navbar";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar (Fixed on the left) */}
      <aside className="md:w-64 xl:w-62 2xl:w-70 text-white fixed inset-y-0 transform translate-x-0 transition-transform duration-200 ease-in-out md:relative md:translate-x-0">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col "> {/* Offset content to match sidebar width */}
        {/* Navbar (Positioned normally so it affects layout) */}
        <div className="fixed top-0 left-0 w-full z-10">
            <Navbar />
        </div>

        {/* Push Outlet Content Below Navbar */}
        <main className="flex-1 w-full overflow-y-auto no-scrollbar xl:mt-12 2xl:mt-[4rem]">
          <Outlet  />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
