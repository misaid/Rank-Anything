import React from "react";
import RoomCreateOrJoin from "./components/RoomCreateOrJoin";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import YourRooms from "./components/YourRooms";

const NavigatePage = () => {
  const defaultRoomId = "test";
  const [userData, setUserData] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
  });
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
        },
      );

      // If code 200 that means verification successful
      if (response.status === 200) {
        setAuthenticated(response.data.valid);
        setUserData(response.data.decoded);
        await getRoomsfromUser(response.data.decoded.userId);
        setLoading(true);
        // initOpinion(roomId, response.data.decoded.userId);
      }
      console.log(response.data);
    } catch (error) {
      console.error("cant find jwt token", error);
      setLoading(true);
      setAuthenticated(false);
      setUserData(null);
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
      const response = await axiosInstance.get(`/user${userId}/rooms`, {
        withCredentials: true,
      });
      setRooms(response.data);
    } catch (error) {
      console.error("Error getting rooms from user:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      {loading ? (
        <div>
          {authenticated ? (
            <div>
              <Navbar
                userData={userData}
                setAuthenticated={setAuthenticated}
                setUserData={setUserData}
              />
              <div className="w-screen mt-48 sm:mt-56 flex items-center justify-center">
                <div className="max-w-[350px] max-h-[350px] flex flex-col items-center justify-center space-y-8">
                  <RoomCreateOrJoin />

                  {rooms && rooms.length > 0 && <YourRooms roomList={rooms} />}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default NavigatePage;
