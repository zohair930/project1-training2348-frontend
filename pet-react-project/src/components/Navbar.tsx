import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'
import { AuthContext } from '../util/types'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const navigate = useNavigate();
  
  const {logout, user} = useAuth();

  const logoutHandler = () => {
    logout();
    navigate('/');
  }

  return (
    <nav className = {styles.navBar}>
      <Link className = {styles.navItem} to = "/">Pets</Link>
      {user ? <button onClick = {logoutHandler} className = {styles.navItem}>Logout</button>: 
      <Link className = {styles.navItem} to = "/login">Login</Link>}
      <Link className = {styles.navItem} to = "/adopted">View Adopted Pets</Link>
      <Link className = {styles.navItem} to = "/add">Add Pet</Link>
    </nav>
  )
}
