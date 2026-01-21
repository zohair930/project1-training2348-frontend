import React, { useState } from 'react'
import { AuthContext, AuthContextValue, Person } from '../util/types';
import axios from 'axios';
import base_url from '../util/url';
import { useNavigate } from 'react-router-dom';

// Set up this provider
// Everything rendered inside of this provider will have access to the context
// So, we have to pass children as parameters so we can pass them along to the AuthContext below
export default function AuthProvider({ children } : {children: React.ReactNode }) {
  // keep track of the logged in user:
  const [user, setUser] = useState<Person | null>(null);

  const navigate = useNavigate();

  // login function, calls our API:
  const login = async (name: string, password: string) => {    
    try {
      let response = await axios.post(`${base_url}/login`, {username: name, password});
      setUser(response.data)
      navigate('/');
    } catch (error:any) {
      console.error(error)
      // keep the message vague for security:
      alert("Username or password is incorrect");
    }
    

  }

  // when we logout, set the user to null:
  const logout = () => {
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    login,
    logout
  }

  return (
    <AuthContext.Provider value = {value}>
      {children}
    </AuthContext.Provider>
  )
}
