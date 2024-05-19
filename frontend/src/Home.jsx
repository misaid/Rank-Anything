import React, { useEffect, useState } from 'react';
import axios from 'axios';
/**
 * Temporary Home component
 * @returns Home component
 */
const Home = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:5555/verifyjwt', {}, {
          withCredentials: true});

        // If code 200 that means verification successful
        if (response.status === 200) {
          setAuthenticated(response.data.valid);
          setUserData(response.data.decoded);
        } else {
          console.error('Failed to verify JWT token:', response.statusText);
          setAuthenticated(false);
          setUserData(null);
        }
      } catch (error) {
        console.error('cant find jwt token', error);
        setAuthenticated(false);
        setUserData(null);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {authenticated ? (
        <div>
          <p>Welcome, {userData.username}!</p>
          <p>Your user ID is {userData.userId}.</p>
        </div>
      ) : (
        <p>Please log in to access this page.</p>
      )}
    </div>
  );
};

export default Home;
