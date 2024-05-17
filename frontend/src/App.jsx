import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import Home from './Home';
// import checkAuth from './checkAuth';

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   async function fetchAuthStatus() {
  //     const isAuthenticated = await checkAuth();
  //     setIsLoggedIn(isAuthenticated);
  //   }
  //   fetchAuthStatus();
  // }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home/>}/>
        {/* <Route path="/home" element={<ProtectedRoute isLoggedIn={isLoggedIn} />} />
        <PrivateRoute path="/home" element={<Home />} isLoggedIn={isLoggedIn} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
