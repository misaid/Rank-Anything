import React, { useState, useEffect, } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import Home from './Home';
import PrivateRoutes from './auth/PrivateRoutes';

/**
 * The main App component that will hold all the routes
 * @returns The main App component
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<PrivateRoutes />}>
          <Route path="/home" element={<Home/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
