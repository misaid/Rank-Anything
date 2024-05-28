import React from "react";
import "../index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const YourRooms = ({ roomList }) => {
  const navigate = useNavigate();
  const handleClick = (event) => {
    console.log(event.target.innerText)
    navigate(`/list/${event.target.innerText}`);
  }
  return (
    // add a border
      <table style={{ boxShadow: '0 0 0 1px black',  borderRadius: '5px' }}>
        <thead className="">
          <tr>
            <th>Your Rooms</th>
            </tr>
          </thead>
        <tbody className="border-t-2 border-black border-solid ">
          {roomList.map((room, index) => (
            <tr onClick={handleClick} key={index} className="hover:bg-slate-200  cursor-pointer">
              <td className="text-xl px-4">{room}</td>
            </tr>
          ))}
        </tbody>
      </table> 
  );
  
};

export default YourRooms;
