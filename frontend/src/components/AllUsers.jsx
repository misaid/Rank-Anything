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
    <div className="border border-solid border-black rounded">
      <div className="border-b border-solid border-black flex justify-center">
          <h2 className="font-bold">Users</h2>
        </div>
      <div className="border-t-2 border-solid border-black ">
        {userList.map((username, index) => (
          <li key={index}className="list-none">
            <ol  className="px-4 text-xl ">{username}</ol>
          </li>
        ))}
      </div>
    </div> 
);
};

export default AllUsers;
