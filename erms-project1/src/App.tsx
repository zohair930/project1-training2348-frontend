import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Navbar from './components/Navbar';
import AuthProvider from './components/AuthProvider';
import Register from './components/Register';
import UserAccount from './components/UserAccount';
import Tickets from './components/Tickets';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path='/login' Component={Login} />
            <Route path='/register' Component={Register} />
            <Route path='/account' Component={UserAccount} />
            <Route path='/tickets' Component={Tickets} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
