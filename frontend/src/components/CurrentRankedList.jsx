import React, { useEffect } from "react";
import { useState } from "react";
import Switch from "./button/Button";
import "./button/styles.css";
import "../index.css";
import { all } from "axios";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
/**
 * This function is the current ranked list component
 * It displays the current ranked list of items and the opinions of the user
 * it also allows for users to switch between the ranked list and the opinions
 * it also allows for users to change and submit ther opinions
 * @param {rankedList} rankedList
 * the ranked list of items
 * @param {roomname} rname
 * the room name
 * @param {opinons} ol
 * the opinions of the users
 * @returns
 * The current ranked lists component
 */
const CurrentRankedList = ({
  // rankedList,
  // rdata,
  // ol: avgOpinion,
  // myOpinion,
  udata,
}) => {
  // needed to make the call to the backend
  const defaultRoomId = "test";
  let { roomId = defaultRoomId } = useParams();
  console.log(roomId, "roomid");

  // found in room call
  // const roomname = rdata.roomname;
  // const creator = rdata.creator;
  const user = udata.userId;
  // const rankedListArray = Object.entries(myOpinion);
  // const opinions = Object.entries(avgOpinion);
  //
  const [loading, setLoading] = useState(false);
  const [creator, setCreator] = useState("");
  const [myRankedList, setMyRankedList] = useState([]);
  const [opinions, setOpinions] = useState([]);

  // only in the componnent itself
  const [item, setItem] = useState("");
  const [selectedOption, setSelectedOption] = useState("Me");
  const navigate = useNavigate();

  /**
   * Fetches room data
   */
  const fetchRoomData = async () => {
    try {
      setLoading(true);
      // Fetch room data including the ranked list, opinions, and users
      const response = await axios.get(`http://localhost:5555/room${roomId}`, {
        withCredentials: true,
      });
      setCreator(response.data.room.creator);
      const avgOpinion = response.data.room.avgOpinion;
      setOpinions(Object.entries(avgOpinion));
      const id = response.data.userId;
      // could be more efficient, should always have a opinion as the call creates a default opinion
      for (let i = 0; i < response.data.room.opinions.length; i++) {
        if (response.data.room.opinions[i].userId === id) {
          const myOpinion = response.data.room.opinions[i].opinions;
          setMyRankedList(Object.entries(myOpinion));
          break;
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  const handleAddition =async (event) => {
    event.preventDefault();
    // console.log(item)
    try {
      const response = await axios.put(
        `http://localhost:5555/room${roomId}/item`,
        { item: item },
        { withCredentials: true }
      );
      console.log(typeof navigate());
      fetchRoomData();
      setItem("");
    } catch (error) {
      console.log("Error adding item to list", error);
    }
  };
  const handleDelete = async  (event) => {
    event.preventDefault();
    try {
      const response =await axios.delete(`http://localhost:5555/room${roomId}/item`, {
        data: { item: item },
        withCredentials: true,
      });
      fetchRoomData();
      setItem("");
    } catch (error) {
      console.log("Error deleting item from list", error);
    }
  };
  const handleSwitchChange = (option) => {
    setSelectedOption(option);
    console.log("Switched to", option);
  };
  useEffect(() => {
    fetchRoomData();
  }, [roomId]);
  return (
    <div>
      <div className="flex justify-center mt-6 mb-4">
        <Switch onSwitchChange={handleSwitchChange} />
      </div>
      {loading ? (<h1 className="flex justify-center text-xs">Loading...</h1>): <h1 className="flex justify-center h-4"></h1>}
      {/* <h1>{selectedOption}</h1> */}

      {selectedOption === "Me" && (
        <div className="flex justify-center mb-6 ">
          <ul className="max-h-[600px] h-[600px] border border-black border-solid rounded">
            {myRankedList
              .sort((a, b) => a[1] - b[1]) // Sort the array by value
              .map(([key, value]) => (
                <li key={key}>
                  <strong>{value}</strong>: {key}
                </li>
              ))}
          </ul>
        </div>
      )}

      {selectedOption !== "Me" && (
        <div className="flex justify-center mb-6 ">
          <ul className="max-h-[600px] overflow-y-scroll">
            {opinions
              .sort((a, b) => a[1] - b[1]) // Sort the array by value
              .map(([key, value]) => (
                <li
                key={key}
                className="text-3xl p-4 border border-black border-solid rounded-3xl mb-3 "
                >
                  <strong>{value}</strong>: {key}
                </li>
              ))}
          </ul>
        </div>
      )}

      {(creator === user || udata.username === "admin") && (
        <div className="w-64 mx-auto border border-black border-solid rounded p-3">
          <form className="flex flex-col gap-4" onSubmit={handleAddition}>
            <div className="flex items-center mb-1 ">
              <input
                type="text"
                placeholder="Add to list"
                autoComplete="off"
                name="email"
                className="w-4/6 px-3 py-2 border-b text-sm border-gray-400  mr-2"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-2 rounded"
                >
                Submit
              </button>
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-700 text-white text-xs font-bold py-2 px-2 rounded"
                onClick={handleDelete}
                >
                Delete
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CurrentRankedList;
