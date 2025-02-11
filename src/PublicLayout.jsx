import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './dashboard/shared/Navbar/Navbar'
import Footer from './dashboard/shared/Footer/Footer'

const PublicLayout = () => {
  return (
    <>
    <NavbarMenu />
      <div>
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default PublicLayout