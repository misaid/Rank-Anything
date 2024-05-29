import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RoomCreateOrJoin = () => {
  const [roomId, setRoomId] = useState("");
  const [croomId, setCRoomId] = useState("");
  const navigate = useNavigate();
  const handleCreateRoom = async (event) => {
    event.preventDefault();
    if (!croomId) {
      return;
    }
    if (croomId.length < 3) {
      console.log("Room ID must be at least 3 characters");
      return;
    }
    if (croomId.length > 20) {
      console.log("Room ID must be at most 20 characters");
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
    <div className="w-full border border-black rounded-xl">
      <h2 className="m-2 text-base">Join Room</h2>
      <form className="m-2 flex flex-col " onSubmit={handleJoinRoom}>
        <div className="flex items-center mb-1 ">
          {/* <label htmlFor="email" className="mr-2">
            <strong>Room ID</strong>
          </label> */}
          <input
            type="text"
            placeholder="Enter Room ID"
            autoComplete="off"
            name="email"
            className="w-4/6 px-3 py-2 border-b text-sm border-gray-400  mr-2"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-2 rounded"
          >
            Join Room
          </button>
        </div>
      </form>
      <h2 className="m-2 text-base">Create Room</h2>
      <form className="flex flex-col m-2 gap-4" onSubmit={handleCreateRoom}>
        <div className="flex items-center mb-1 ">
          {/* <label htmlFor="email" className="mr-2">
            <strong>Room ID</strong>
          </label> */}
          <input
            type="text"
            placeholder="Enter Room ID"
            autoComplete="off"
            name="email"
            className="w-4/6 px-3 py-2 mr-2 border-b text-sm border-gray-400 "
            value={croomId}
            onChange={(e) => setCRoomId(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-2 rounded"
          >
            Create Room
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomCreateOrJoin;
