import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import rankingImage from "../assets/ranking.png";
import logoutImage from "../assets/logout.png";

const Navbar = ({ userData, setAuthenticated, setUserData }) => {
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
        { withCredentials: true },
      );

      setAuthenticated(false);
      setUserData(null);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <div className="flex md:text-xl text-sm bg-slate-300 border-b border-solid border-black select-none md:h-20 items-center">
      <div className="h-full p-3 md:p-6  break-words flex items-center">
        <p>Welcome, {userData.username}</p>
      </div>
      <div className="h-full p-6 md:space-x-10 space-x-5 md:text-3xl text-base justify-center items-center flex flex-1 border-x border-black border-solid">
        <h1>Rank Anything </h1>
        <img src={rankingImage} className="md:h-10 h-5" alt="Rank Anything" />
      </div>
      <div
        className="p-6 flex border-r cursor-pointer items-center"
        onClick={logout}
      >
        <p>Logout, </p>
        <img className="ml-4 md:h-6 h-3" src={logoutImage} alt="Logout" />
      </div>
    </div>
  );
};

export default Navbar;
