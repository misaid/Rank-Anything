import React from "react";
import { useEffect } from "react";
/**
 * This is the all user component. It displays all the users in the room
 * @param {*} userList
 * The list of users 
 * @returns 
 * The all user component
 */
const AllUsers = ({ userList }) => {
  return (
    <div style={{ border: '2px solid black', borderRadius: '8px' }}>
      <div style={{ borderBottom: '1px solid black '}}>
      <h1>All Users: </h1>
      </div>
      <ul>
        {userList.map((username, index) => (
          <li key={index}>{username}</li>
        ))}
      </ul>
    </div>
  );
};

export default AllUsers;
