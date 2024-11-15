import React from "react";
import { useEffect } from "react";
/**
 * This is the all user component. It displays all the users in the room
 * @param {Array} userList
 * The list of users
 * @returns
 * The all user component
 */
const AllUsers = ({ userList }) => {
  return (
    <div className="border rounded-xl shadow-md">
      <div className="border-b flex justify-center py-2">
        <h2 className="font-bold">Users</h2>
      </div>
      <div className="border-t-2 max-h-64 overflow-y-auto ">
        {userList.map((username, index) => (
          <li key={index} className="list-none">
            <ol className="px-4 text-xl ">{username}</ol>
          </li>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
