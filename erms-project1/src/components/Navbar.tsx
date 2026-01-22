import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'
import { AuthContext, UserType } from '../util/types'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const navigate = useNavigate();
  
  const {logout, user} = useAuth();

  const logoutHandler = () => {
    console.log(user)
    logout();
    navigate('/');
  }

  return (
    <nav className = {styles.navBar}>
      {user ? <button onClick = {logoutHandler} className = {styles.navItem}>Logout</button>: 
      <Link className = {styles.navItem} to = "/login">Login</Link>}
      <Link className = {styles.navItem} to = "/register">Register</Link>
      {user ? <span>Welcome, {user.username}!</span> : <span>Welcome, Guest!</span>}
      {(user?.account && (user.userType === UserType.EMPLOYEE)) ? <Link className = {styles.navItem} to = "/tickets">View My Tickets</Link> : null}
      {(user?.account && (user.userType === UserType.MANAGER)) ? <Link className = {styles.navItem} to = "/tickets">View All Tickets</Link> : null}

    </nav>
  )
}
