import React, { useEffect, useState } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';


/**
 * This function is a react component that will verify the jwt token and return the appropriate component
 * @returns 
 * if auth is null this function will return a loading div
 * if auth is true it will return the Outlet component
 * if auth is false it will return the Navigate component
 
 */
const PrivateRoutes = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post('http://localhost:5555/verifyjwt', {}, {
          withCredentials: true,
        });
        setAuth(response.data.valid);
        console.log("this is the auth state", response.data.valid)
        console.log(auth)
      } catch (error) {
        console.error('Cannot find JWT token', error);
        setAuth(false);
      }
    };
    
    verifyToken();
  }, []);

  if (auth === null) {
    return <div>Loading...</div>;
  }

  return (
    auth ? <Outlet /> : <Navigate to="/login" />
  );
};

export default PrivateRoutes;