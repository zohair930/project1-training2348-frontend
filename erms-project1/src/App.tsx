import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Pets from './components/Pets';
import PetItem from './components/PetItem';
import Login from './components/Login';
import Navbar from './components/Navbar';
import AuthProvider from './components/AuthProvider';
import AdoptedPets from './components/AdoptedPets';
import AddPet from './components/AddPet';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path='/' Component={Pets} />
            <Route path='/pets/:id' Component={PetItem} />
            <Route path='/login' Component={Login} />
            <Route path='/adopted' Component={AdoptedPets}/>
            <Route path ='/add' Component={AddPet} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
