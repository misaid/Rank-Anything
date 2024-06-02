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
      <div className="border border-solid border-black rounded max-w-64 select-none">
        <div className="flex justify-center border-b border-solid border-black">
          <h2 className="font-bold">
            Your Rooms
            </h2>
          </div>
        <div className="border-t-2 border-black border-solid max-h-64 overflow-y-auto">
          {roomList.map((room, index) => (
            <li onClick={handleClick} key={index} className="hover:bg-slate-200  cursor-pointer list-none">
              <ol className="text-xl px-4 max-q-64 break-words overflow-hidden">{room}</ol>
            </li>
          ))}
        </div>
      </div> 
  );
  
};

export default YourRooms;
