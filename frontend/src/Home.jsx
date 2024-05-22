import React, { useEffect, useState } from "react";
import axios from "axios";
import AllUsers from "../components/AllUsers";
import CurrentRankedList from "../components/CurrentRankedList";
import { useParams } from "react-router-dom";
import YourRooms from "../components/YourRooms";
//TODO: finsih up intitializing opinion and changing opinion
/**
 * Temporary Home component
 * @returns Home component
 */
const Home = () => {
  const [userData, setUserData] = useState(null);
  const defaultRoomId = "test";
  let { roomId } = useParams();
  const [rankedList, setRankedList] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [opinion, setOpinion] = useState(null);
  const [loading, setLoading] = useState(false);
  /**
   * sends opinion to server
   * @param {*} roomId
   * @param {*} userId
   */
  const initOpinion = async (roomId, userId) => {
    console.log(1);
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
    console.log(2);
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
    console.log(3);
    if (!roomId | !userId) {
      console.log("no room id or no user id");
      return;
    }
    try {
      const roomCheckResponse = await axios.get(
        `http://localhost:5555/room${roomId}`,
        { withCredentials: true }
      );
      if (!roomCheckResponse.data) {
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
      await setUsers(roomCheckResponse.data.users);
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
    console.log(4);
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
      await setUsers(users);
      setLoading(true);
      //console.log(response.data);
    } catch (error) {
      console.error("Error adding user to room:", error);
    }
  };
  /**
   * Fetches room data
   */
  const fetchRoomData = async () => {
    console.log(6);

    try {
      // Fetch room data including the ranked list
      //console.log(`http://localhost:5555/room${roomId}`);
      const response = await axios.get(`http://localhost:5555/room${roomId}`);
      //console.log(response.data.defaultRankedList);

      setRankedList(response.data.defaultRankedList);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };
  /**
   * fetches user data
   */
  const fetchData = async () => {
    console.log(7);
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
        await setAuthenticated(response.data.valid);
        setUserData(response.data.decoded);
        addRoomToUser(roomId, response.data.decoded.userId);
        await addUserToRoom(roomId, response.data.decoded.username);
        await getRoomsfromUser(response.data.decoded.userId);
        initOpinion(roomId, response.data.decoded.userId);
      }
    } catch (error) {
      console.error("cant find jwt token", error);
      setAuthenticated(false);
      setUserData(null);
      setRankedList(null);
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
              <div className="bg-red-400">
                <AllUsers userList={users} />
              </div>
              <div className="bg-orange-400">
                <h1>Room id: {roomId}</h1>
              </div>
              <div className="bg-yellow-400">
                <CurrentRankedList rankedList={rankedList} />
              </div>
              <div className="bg-green-400">
                <p>Welcome, {userData.username}!</p>
              </div>
              <div className="bg-blue-400">
                <p>Your user ID is {userData.userId}.</p>
              </div>
              <div className="bg-indigo-400">
                <YourRooms roomList={rooms} />
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
