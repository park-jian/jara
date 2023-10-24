import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthContextProvider } from './components/context/AuthContext';
import Header from './components/Header';

function App() {
  return <AuthContextProvider>
    <Navbar />
    <Header />
    <Outlet />
  </AuthContextProvider>;
}

export default App;
