import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RoomCreateOrJoin = () => {
  const [roomId, setRoomId] = useState();
  const [croomId, setCRoomId] = useState();
  const navigate = useNavigate();
  const handleCreateRoom = async (event) => {
    event.preventDefault();
    if (!croomId) {
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5555/room${croomId}`,
        {
          withCredentials: true,
        }
      );
      navigate(`/list/${croomId}`);
      setRoomId("");
      setCRoomId("");
    } catch (error) {
      console.log("Room creation failed");
    }
  };
  const handleJoinRoom = async (event) => {
    event.preventDefault();
    if (!roomId) {
      return;
    }
    console.log("Joining room", roomId);
    try {
      const response = await axios.get(`http://localhost:5555/room${roomId}`, {
        withCredentials: true,
      });
      if (response.status !== 200) {
        console.log("Room not found");
        return;
      } else {
        // console.log(response.data);
        navigate(`/list/${roomId}`);
      }
      setCRoomId("");
      setRoomId("");
    } catch (error) {
      console.log("Room join failed");
    }
  };
  return (
    <div style={{ border: "1px solid black", borderRadius: "8px" }}>
      <h2 className="mb-2 text-2xl">Join Room</h2>
      <form className="flex flex-col gap-4" onSubmit={handleJoinRoom}>
        <div className="flex items-center mb-1 ">
          {/* <label htmlFor="email" className="mr-2">
            <strong>Room ID</strong>
          </label> */}
          <input
            type="text"
            placeholder="Enter Room ID"
            autoComplete="off"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 rounded mr-2"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Join Room
          </button>
        </div>
      </form>
      <h2 className="mb-2 text-2xl">Create Room</h2>
      <form className="flex flex-col gap-4" onSubmit={handleCreateRoom}>
        <div className="flex items-center mb-1 ">
          {/* <label htmlFor="email" className="mr-2">
            <strong>Room ID</strong>
          </label> */}
          <input
            type="text"
            placeholder="Enter Room ID"
            autoComplete="off"
            name="email"
            className="w-full px-3 py-2 mr-2 border border-gray-300 rounded"
            value={croomId}
            onChange={(e) => setCRoomId(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Room
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomCreateOrJoin;
