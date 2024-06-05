import React, { useEffect, useState } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress } from "@mui/material";

/**
 * This function is a react component that will verify the jwt token and return the appropriate component
 * @returns 
 * if auth is null this function will return a loading div
 * if auth is true it will return the Outlet component
 * if auth is false it will return the Navigate component
 
 */
const PrivateRoutes = () => {
  const [auth, setAuth] = useState(null);
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
  });
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axiosInstance.post('/verifyjwt', {}, {
          withCredentials: true,
        });
        setAuth(response.data.valid);
      } catch (error) {
        console.error('Cannot find JWT token', error);
        setAuth(false);
      }
    };
    
    verifyToken();
  }, []);

  if (auth === null) {
    return<div className="flex justify-center items-center h-screen"><div className="flex-row justify-center items-center"><CircularProgress /><p>Loading</p></div></div>;
  }

  return (
    auth ? <Outlet /> : <Navigate to="/login" />
  );
};

export default PrivateRoutes;