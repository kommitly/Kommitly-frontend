import React from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from './shared/Sidebar/Sidebar';
import Navbar from './shared/Navbar/Navbar';
import { Divider } from '@mui/material';


const Dashboard = () => {

  return (
    <div className='flex h-screen'>
        <aside className='md:w-64  xl:w-64 2xl:w-70  text-white fixed inset-y-0 transform translate-x-0 transition-transform duration-200 ease-in-out md:relative md:translate-x-0'>
            <Sidebar />  
        </aside>
       {/* { <Divider orientation="vertical" variant="middle" flexItem /> } */}
        <div className="flex-1 flex flex-col  ">
        <Navbar />
        {/* {<Divider orientation="horizontal" flexItem style={{ marginTop: '4rem'  }} /> } */}
        <main className="flex-1 w-full  overflow-y-scroll no-scrollbar  2xl:mt-8 mt-4 xl:mt-6">
          <Outlet />
        </main>
      </div>

    </div>
  )
}

export default Dashboard