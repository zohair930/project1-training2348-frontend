import React, { useState } from 'react'
import { AuthContext, AuthContextValue, User, UserType } from '../util/types';
import axios from 'axios';
import base_url from '../util/url';
import { useNavigate } from 'react-router-dom';

// Set up this provider
// Everything rendered inside of this provider will have access to the context
// So, we have to pass children as parameters so we can pass them along to the AuthContext below
export default function AuthProvider({ children } : {children: React.ReactNode }) {
  // keep track of the logged in user:
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  // login function, calls our API:
  const login = async (username: string, password: string) => {    
    try {
      let user = {username: username, password: password};
      let response = await axios.post(`${base_url}/login`, user);
      setUser(response.data)
      navigate('/account');
    } catch (error:any) {
      console.error(error)
      // keep the message vague for security:
      alert("Username or password is incorrect");
    }
    

  }

    const register = async (username: string, password: string, userType?: UserType) => {    
    try {
      let user = {username: username, password: password};
      let response = await axios.post(`${base_url}/register`, user);
      setUser(response.data)
      navigate('/account');
    } catch (error:any) {
      console.error(error)
      // keep the message vague for security:
      alert("Username is taken, please choose another");
    }
  }

  // when we logout, set the user to null:
  const logout = () => {
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value = {value}>
      {children}
    </AuthContext.Provider>
  )
}
