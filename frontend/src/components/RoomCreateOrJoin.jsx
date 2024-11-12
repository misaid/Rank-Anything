import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RoomCreateOrJoin = () => {
  const [roomId, setRoomId] = useState("");
  const [croomId, setCRoomId] = useState("");
  const navigate = useNavigate();

  // code from https://material-ui.com/components/snackbars/
  const [snackPack, setSnackPack] = React.useState([]);
  const [messageInfo, setMessageInfo] = React.useState(undefined);
  const [open, setOpen] = React.useState(false);
  // axio instance
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
  });
  /**
   * This function handles the exit of a snackbar
   */
  const handleExited = () => {
    setMessageInfo(undefined);
  };
  /**
   * This function handles the closing of a snackbar
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * This function creates a room
   * @param {Event} event The event that triggered the function
   * @returns null
   * */
  const handleCreateRoom = async (event) => {
    event.preventDefault();
    if (!croomId) {
      return;
    }
    if (croomId.length < 3) {
      const message = "Room ID must be at least 3 characters";
      setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
      console.log("Room ID must be at least 3 characters");
      return;
    }
    if (croomId.length > 20) {
      const message = "Room ID must be at most 20 characters";
      setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
      console.log("Room ID must be at most 20 characters");
      return;
    }
    try {
      const response = await axiosInstance.post(
        `/room${croomId}`,
        {},
        {
          withCredentials: true,
        },
      );
      navigate(`/list/${croomId}`);
      setRoomId("");
      setCRoomId("");
    } catch (error) {
      const message = "Room already exists";
      setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
      console.log("Room creation failed");
    }
  };

  /**
   * This function joins a room
   */
  const handleJoinRoom = async (event) => {
    event.preventDefault();
    if (!roomId) {
      return;
    }
    //console.log("Joining room", roomId);
    try {
      const response = await axiosInstance.get(`/room${roomId}`, {
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
      const message = "Room does not exist";
      setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
      console.log("Room join failed");
    }
  };

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  return (
    <div className="w-full border shadow-md rounded-xl p-4">
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        message={messageInfo ? messageInfo.message : undefined}
      />
      <h2 className="m-2 text-base">Join Room</h2>
      <form className="m-2 flex flex-col " onSubmit={handleJoinRoom}>
        <div className="flex items-center mb-1 ">
          {/* <label htmlFor="email" className="mr-2">
            <strong>Room ID</strong>
          </label> */}
          <Input
            type="text"
            placeholder="Enter Room ID"
            autoComplete="off"
            name="text"
            className="w-4/6 px-3 py-2 border-b text-base border-gray-400  mr-2"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <Button type="submit" className="bg-blue-500 hover:bg-blue-700">
            Join
          </Button>
        </div>
      </form>
      <h2 className="m-2 text-base">Create Room</h2>
      <form className="flex flex-col m-2 gap-4" onSubmit={handleCreateRoom}>
        <div className="flex items-center mb-1 ">
          {/* <label htmlFor="email" className="mr-2">
            <strong>Room ID</strong>
          </label> */}
          <Input
            type="text"
            placeholder="Enter Room ID"
            autoComplete="off"
            name="text"
            className="w-4/6 px-3 py-2 mr-2 border-b text-base border-gray-400 "
            value={croomId}
            onChange={(e) => setCRoomId(e.target.value)}
          />
          <Button type="submit" className="bg-blue-500 hover:bg-blue-700">
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RoomCreateOrJoin;
