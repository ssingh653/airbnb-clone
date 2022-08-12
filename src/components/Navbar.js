import React from 'react'
import logo from '../images/airbnb-logo.png'

export default function Navbar(){
    return(
        <nav className='nav-bar'>
            <img src={logo} alt='airbnb' />
        </nav>
    )
}