import React from "react";
import "../src/index.css";
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
      <table className="
      border-2 border-black border-solid rounded
      ">
        <thead className="border-2 border-black border-solid rounded">
          <tr>
            <th>Your Rooms</th>
            </tr>
          </thead>
        <tbody>
          {roomList.map((room, index) => (
            <tr onClick={handleClick} key={index} className={"hover:bg-slate-400"}>
              <td>{room}</td>
            </tr>
          ))}
        </tbody>
      </table> 
  );
  
};

export default YourRooms;
