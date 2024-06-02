import React, { useEffect, useState } from "react";
import axios from "axios";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
//import dotenv from "dotenv";
// Components
import AllUsers from "./components/AllUsers";
import CurrentRankedList from "./components/CurrentRankedList";
import YourRooms from "./components/YourRooms";
import RoomCreateOrJoin from "./components/RoomCreateOrJoin";
import "./index.css";
// Images
import rankingImage from "./assets/ranking.png";
import logoutImage from "./assets/logout.png";

/**
 * Home component
 * @returns Home component
 */
const Home = () => {
  const defaultRoomId = "test";
  let { roomId = defaultRoomId } = useParams();
  // Mostly static data
  const [userData, setUserData] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
  });
  /**
   * This function logs out the user
   * @returns null
   * */
  const logout = async () => {
    try {
      const response = await axiosInstance.post(
        "/logout",
        {},
        { withCredentials: true }
      );

      setAuthenticated(false);
      setUserData(null);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  /**
   * This function obtains all the users rooms
   * @param {String} userId The userId we get rooms from
   * @returns null
   */
  const getRoomsfromUser = async (userId) => {
    if (!userId) {
      console.log("no user id");
      return;
    }
    try {
      const response = await axiosInstance.get(
        `/user${userId}/rooms`,
        { withCredentials: true }
      );
      setRooms(response.data);
    } catch (error) {
      console.error("Error getting rooms from user:", error);
    }
  };
  /**
   * This function adds a room to a user object
   * @param {String} roomId The room id to add to the user
   * @param {String} userId the user that room id will be added to
   * @returns null
   */
  const addRoomToUser = async (roomId, userId) => {
    if (!roomId | !userId) {
      console.log("no room id or no user id");
      return;
    }
    try {
      const roomCheckResponse = await axiosInstance.get(
        `/room${roomId}`,
        { withCredentials: true }
      );
      if (!roomCheckResponse.data.room) {
        console.error("Room does not exist");
        return;
      }
      const response = await axiosInstance.post(
        `/user${userId}/room`,
        {
          roomId: roomId,
        },
        { withCredentials: true }
      );
      // console.log(roomCheckResponse.data)
      setUsers(roomCheckResponse.data.room.users);

      //console.log(response.data);
    } catch (error) {
      console.error("Error adding room to user:", error);
    }
  };
  /**
   * adds user to room
   * @param {String} roomId
   * @param {String} username
   * @returns
   */
  const addUserToRoom = async (roomId, username) => {
    if (!username | !roomId) {
      return;
    }
    try {
      const response = await axiosInstance.post(
        `/room${roomId}/user`,
        {
          username: username,
        },
        { withCredentials: true }
      );
      //console.log(response.data);
    } catch (error) {
      console.error("Error adding user to room:", error);
    }
  };
  /**
   * fetches user data
   */
  const fetchData = async () => {
    try {
      const response = await axiosInstance.post(
        "/verifyjwt",
        {},
        {
          withCredentials: true,
        }
      );

      // If code 200 that means verification successful
      if (response.status === 200) {
        setAuthenticated(response.data.valid);
        setUserData(response.data.decoded);
        await addRoomToUser(roomId, response.data.decoded.userId);
        await addUserToRoom(roomId, response.data.decoded.username);
        await getRoomsfromUser(response.data.decoded.userId);
        setLoading(true);
        // initOpinion(roomId, response.data.decoded.userId);
      }
    } catch (error) {
      console.error("cant find jwt token", error);
      setAuthenticated(false);
      setUserData(null);
    }
  };

  useEffect(() => {
    console.log("useEffect Started for", roomId);
    fetchData();
  }, [roomId]);

  return (
    <div>
      {loading ? (
        <div>
          {authenticated ? (
            <div>
              <div className="flex text-xl  bg-slate-300 border-b border-solid border-black select-none  h-[80px]">
                <div className="border p-6 border-black border-solid">
                  <p>Welcome, {userData.username}</p>
                </div>
                <div className="p-5 justify-center flex flex-1 text-3xl border border-black border-solid space-x-10">
                  <h1>Rank Anything </h1>
                  <img src={rankingImage} alt="Rank Anything" />
                </div>
                <div
                  className="p-6  flex border border-black border-solid cursor-pointer"
                  onClick={logout}
                >
                  <p>Logout, </p>{" "}
                  <img src={logoutImage} className=" ml-4 h-6" alt="Logout" />
                </div>
              </div>
              {/* <div className="">
                <p>Your user ID is {userData.userId}.</p>
              </div> */}
              <div className="flex flex-wrap w-full ">
                <div className=" flex-1 mx-10 mt-60">
                  <div className="w-80">
                    <RoomCreateOrJoin />
                  </div>
                  <div className="mt-32">
                    <YourRooms roomList={rooms} />
                  </div>
                </div>
                <div className="flex-grow ">
                  <div className="flex justify-center mt-6">
                    {/* rounded bg-black hover:bg-white hover:rounded-none */}
                    <h1 className="text-5xl ">
                      Ranking:{" "}
                      <span className="border-b-2 border-solid border-black ">
                        {" "}
                        {roomId}
                      </span>
                    </h1>
                  </div>
                  <div className=" ">
                    <CurrentRankedList udata={userData} />
                  </div>
                </div>
                <div className="flex-1 m-5 mt-60 ">
                  <div className="w-80 mx-auto">
                    <AllUsers
                      userList={users}
                      roomId={roomId}
                      //opinionList={opinionList}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>Please log in to access this page.</p>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="flex ">
          <p> Loading...</p>
          <CircularProgress />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
