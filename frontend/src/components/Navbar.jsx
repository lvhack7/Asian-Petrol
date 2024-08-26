import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className='flex items-center space-x-10 p-8'>
        <Link to={"/reference"} className='text-blue-500'>
            Справочник
        </Link>
        <Link to={"/deals"} className='text-blue-500'>
            Сделки
        </Link>
        <Link to={"/passport"} className='text-blue-500'>
            Паспорт
        </Link>
    </nav>
  )
}

export default Navbar