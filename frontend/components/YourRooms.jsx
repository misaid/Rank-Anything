import React from "react";

const YourRooms = ({ roomList }) => {
  return (
    <div style={{ border: '1px solid black', borderRadius: '8px' }}>
      <h1>Your rooms: </h1>
      <ul>
        {roomList.map((key, value) => (
          <li key={value}>{key}</li>
        ))}
      </ul>
    </div>
  );
};

export default YourRooms;
