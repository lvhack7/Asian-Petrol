import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className='flex items-center justify-around space-x-10 p-8'>
        <Link to={"/deals"} className='text-blue-500'>
            Сделки
        </Link>
        <Link to={"/reference"} className='text-blue-500'>
            Справочник
        </Link>
    </nav>
  )
}

export default Navbar