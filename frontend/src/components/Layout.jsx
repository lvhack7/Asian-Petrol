import React from 'react'
import Navbar from './Navbar'
import { Outlet, Navigate } from 'react-router-dom'

const Layout = () => {

  if (!localStorage.getItem("token")) {
    return <Navigate to={"/login"} />
  }

  return (
    <div className='flex flex-col'>
        <Navbar/>
        <div className='p-10'>
          <Outlet/>
        </div>
    </div>
  )
}

export default Layout