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
    <table   style={{ boxShadow: '0 0 0 1px black',  borderRadius: '5px' }}>
      <thead className="">
        <tr>
          <th>Users</th>
          </tr>
        </thead>
      <tbody className="border-t-2 border-solid border-black ">
        {userList.map((username, index) => (
          <tr className="">
            <td className="px-4 text-xl">{username}</td>
          </tr>
        ))}
      </tbody>
    </table> 
);
};

export default AllUsers;
