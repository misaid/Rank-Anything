import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import rankingImage from "../assets/ranking.png";
import { LogOut, User, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = ({ userData, setAuthenticated, setUserData }) => {
  const navigate = useNavigate();
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
  });
  /**
   * This function logs out the user
   * @returns null
   * */
  const handleLogout = async () => {
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
    <div className="flex flex-row border border-b items-center justify-between py-4 px-8">
      <div className="h-full justify-center items-center flex md:space-x-4 space-x-2 md:text-3xl text-base">
        <img src={rankingImage} className="md:h-10 h-5" alt="Rank Anything" />
        <h1>Rank Anything </h1>
      </div>

      <div className="flex flex-row space-x-2 sm:space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative w-full space-x-1 p-2.5"
          onClick={() => navigate("/")}
        >
          <Compass />
          <span className="hidden sm:inline text-base">Home</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <User className="w-5 h-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{userData.username}</DropdownMenuLabel>
            <DropdownMenuSeparator></DropdownMenuSeparator>

            <DropdownMenuItem>
              <div
                className="hover:cursor-pointer w-full h-full flex flex-row justify-between items-center "
                onClick={() => handleLogout()}
              >
                Logout <LogOut />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
