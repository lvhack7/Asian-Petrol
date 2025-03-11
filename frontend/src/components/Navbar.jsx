import { Button } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className='flex items-center justify-between p-2 lg:p-8'>
        <div className='flex items-center space-x-4'>
        <Link to={"/reference"} className='text-blue-500'>
            Справочник
        </Link>
        <Link to={"/deals"} className='text-blue-500'>
            Сделки
        </Link>
        <Link to={"/passport-kz"} className='text-blue-500'>
            Паспорт KZ
        </Link>
        <Link to={"/passport-kg"} className='text-blue-500'>
            Паспорт KG
        </Link>
        </div>
        <Button type='danger' onClick={() => {
            localStorage.removeItem('token')
            window.location.reload()
        }}>
            Выйти
        </Button>
    </nav>
  )
}

export default Navbar