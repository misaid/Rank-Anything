import React, { useEffect, useState } from "react";
import axios from "axios";
import AllUsers from "./components/AllUsers";
import CurrentRankedList from "./components/CurrentRankedList";
import { redirect, useNavigate, useParams } from "react-router-dom";
import YourRooms from "./components/YourRooms";
import Room from "../../backend/models/room";
import RoomCreateOrJoin from "./components/RoomCreateOrJoin";
import "./index.css";
//TODO: finsih up intitializing opinion and changing opinion
/**
 * Temporary Home component
 * @returns Home component
 */
const Home = () => {
  const [userData, setUserData] = useState(null);
  const defaultRoomId = "test";
  let { roomId = defaultRoomId } = useParams();
  const [rankedList, setRankedList] = useState([]);
  const [opinionList, setOpinionList] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [opinion, setOpinion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [myOpinion, setMyOpinion] = useState(null);
  const navigate = useNavigate();
  /**
   * sends opinion to server
   * @param {*} roomId
   * @param {*} userId
   */
  const logout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5555/logout",
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
  const initOpinion = async (roomId, userId) => {
    const test = {
      Apple: 100,
      Banana: 2,
      Kiwi: 3,
      Orange: 4,
      Pineapple: 5,
      Tomato: 6,
      Peaches: 7,
    };
    const payload = { [userId]: test };

    try {
      // NEED user data
      console.log("initOpinion", roomId);
      const response = await axios.post(
        `http://localhost:5555/room${roomId}/opinions`,
        payload,
        { withCredentials: true }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error pushing opinion to user:", error);
    }
  };
  /**
   * This function obtains all the users rooms
   * @param {*} userId The userId we get rooms from
   * @returns null
   */
  const getRoomsfromUser = async (userId) => {
    if (!userId) {
      console.log("no user id");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5555/user${userId}/rooms`,
        { withCredentials: true }
      );
      setRooms(response.data);
    } catch (error) {
      console.error("Error getting rooms from user:", error);
    }
  };
  /**
   * This function adds a room to a user object
   * @param {*} roomId The room id to add to the user
   * @param {*} userId the user that room id will be added to
   * @returns null
   */
  const addRoomToUser = async (roomId, userId) => {
    if (!roomId | !userId) {
      console.log("no room id or no user id");
      return;
    }
    try {
      const roomCheckResponse = await axios.get(
        `http://localhost:5555/room${roomId}`,
        { withCredentials: true }
      );
      if (!roomCheckResponse.data.room) {
        console.error("Room does not exist");
        return;
      }
      const response = await axios.post(
        `http://localhost:5555/user${userId}/room`,
        {
          roomId: roomId,
        },
        { withCredentials: true }
      );
      // console.log(roomCheckResponse.data)
      await setUsers(roomCheckResponse.data.room.users);

      //console.log(response.data);
    } catch (error) {
      console.error("Error adding room to user:", error);
    }
  };
  /**
   * adds user to room
   * @param {*} roomId
   * @param {*} username
   * @returns
   */
  const addUserToRoom = async (roomId, username) => {
    if (!username | !roomId) {
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5555/room${roomId}/user`,
        {
          username: username,
        }
      );
      //console.log(response.data);
    } catch (error) {
      console.error("Error adding user to room:", error);
    }
  };
  /**
   * Fetches room data
   */
  const fetchRoomData = async () => {
    try {
      // Fetch room data including the ranked list, opinions, and users
      const response = await axios.get(`http://localhost:5555/room${roomId}`, {
        withCredentials: true,
      });
      setRankedList(response.data.room.defaultRankedList);
      setOpinionList(response.data.room.avgOpinion);
      setUsers(response.data.room.users);
      const id = response.data.userId;

      // could be more efficient, should always have a opinion as the call creates a default opinion
      for (let i = 0; i < response.data.room.opinions.length; i++) {
        if (response.data.room.opinions[i].userId === id) {
          setMyOpinion(response.data.room.opinions[i].opinions);
          console.log("found");
          break;
        }
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };
  /**
   * fetches user data
   */
  const fetchData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5555/verifyjwt",
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
      setRankedList(null);
      setOpinionList(null);
      setUsers(null);
    }
  };

  useEffect(() => {
    console.log("useEffect Started for", roomId);
    fetchRoomData();
    fetchData();
  }, [roomId]);

  return (
    <div>
      {loading ? (
        <div>
          {authenticated ? (
            <div>
              <div className="flex text-xl  bg-slate-300 border-b border-solid border-black">
                <div className="border p-5 border-black border-solid">
                  <p>Welcome, {userData.username}</p>
                </div>
                <div className="p-5 justify-center flex flex-1 border border-black border-solid space-x-10">
                  <h1>Rank Anything </h1>
                  <img src="assets/ranking.png" alt="Rank Anything" />
                </div>
                <div
                  className="p-5  flex border border-black border-solid cursor-pointer"
                  onClick={logout}
                >
                  <p>Logout, </p> <img src="assets\logout.png" alt="Logout" />
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
                    <CurrentRankedList
                      rankedList={rankedList}
                      rname={roomId}
                      ol={opinionList}
                      myOpinion={myOpinion}
                    />
                  </div>
                </div>
                <div className="flex-1 m-5 mt-60 ">
                  <div className="w-80 mx-auto">
                    <AllUsers
                      userList={users}
                      roomId={roomId}
                      opinionList={opinionList}
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
        <p> Loading</p>
      )}
    </div>
  );
};

export default Home;
