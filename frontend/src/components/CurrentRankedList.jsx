import React, { useEffect, useState } from "react";
import Switch from "./button/Button";
import "./button/styles.css";
import "../index.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Snackbar from "@mui/material/Snackbar";

/**
 * This function is the current ranked list component
 * It displays the current ranked list of items and the opinions of the user
 * it also allows for users to switch between the ranked list and the opinions
 * it also allows for users to change and submit ther opinions
 * @param {Object} udata
 * The user data (static) we are only using userId from this
 * @returns
 * The current ranked list component
 */
const CurrentRankedList = ({ udata }) => {
  // needed to make the call to the backend
  const defaultRoomId = "test";
  let { roomId = defaultRoomId } = useParams();
  const user = udata.userId;

  // code from https://mui.com/components/snackbars/
  const [snackPack, setSnackPack] = React.useState([]);
  const [messageInfo, setMessageInfo] = React.useState(undefined);
  const [open, setOpen] = React.useState(false);

  const [loading, setLoading] = useState(false);
  const [creator, setCreator] = useState("");
  const [myRankedList, setMyRankedList] = useState([]);
  const [opinions, setOpinions] = useState([]);

  // only in the componnent itself
  const [item, setItem] = useState("");
  const [selectedOption, setSelectedOption] = useState("Me");
  const navigate = useNavigate();

  // Axios instance
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
  });

  /**
   * Handles the drag end event
   * @param {Event} result
   * The result of the drag end event
   * @returns
   * null
   * */
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    // indexed by 1
    const items = Array.from(myRankedList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const updatedItems = items.map((item, index) => [item[0], index + 1]);
    // console.log("New My Opnions: ", objectFromEntries(updatedItems));
    // turn into json object
    const myOpinion1 = Object.fromEntries(updatedItems);
    console.log("New: ", myOpinion1);
    putMyOpinion(updatedItems);
    setMyRankedList(updatedItems);
  };

  /**
   * put myOpinon to the backend
   * @param {String} dndOpinion
   * The new opinion to be put
   * @returns
   * null
   */
  const putMyOpinion = async (dndOpinion) => {
    try {
      const response = await axiosInstance.put(
        `/room${roomId}/opinion`,
        { opinion: dndOpinion },
        { withCredentials: true }
      );
      console.log("Opinion updated");
    } catch (error) {
      console.error("Error updating opinion:", error);
    }
  };
  /**
   * Fetches room data
   */
  const fetchRoomData = async () => {
    try {
      setLoading(true);
      // Fetch room data including the ranked list, opinions, and users
      const response = await axiosInstance.get(`/room${roomId}`, {
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
          console.log("original myOpinion: ", myOpinion);
          setMyRankedList(Object.entries(myOpinion));
          break;
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  /**
   * Handles the addition of an item to the ranked list
   * @param {Event} event
   * The event that triggers the function
   * @returns
   * null
   * */
  const handleAddition = async (event) => {
    event.preventDefault();
    // console.log(item)

    try {
      const response = await axiosInstance.put(
        `/room${roomId}/item`,
        { item: item },
        { withCredentials: true }
      );
      console.log(typeof navigate());
      fetchRoomData();
      setItem("");
      // notify the user that the item has been added
      const message = "Item added to list";
      setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
    } catch (error) {
      if (item.includes(".")) {
        setItem("");
        const message = "Cannot have periods in item names";
        setSnackPack((prev) => [
          ...prev,
          { message, key: new Date().getTime() },
        ]);
        return;
      }
      const message = "Duplicate item or error adding item to list";
      setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
      console.log("Error adding item to list", error);
    }
  };

  /**
   * Handles the deletion of an item from the ranked list
   * @param {Event} event
   * The event that triggers the function
   * @returns
   * null
   * */
  const handleDelete = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.delete(`/room${roomId}/item`, {
        data: { item: item },
        withCredentials: true,
      });
      fetchRoomData();
      setItem("");
      const message = "Item deleted from list";
      setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
    } catch (error) {
      const message = "Error deleting item from list";
      setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
      console.log("Error deleting item from list", error);
    }
  };

  /**
   * Handles the switch change
   * @param {*} option
   * The option to switch to
   *  @returns
   * null
   * */
  const handleSwitchChange = (option) => {
    setSelectedOption(option);
    fetchRoomData();
    console.log("Switched to", option);
  };

  useEffect(() => {
    fetchRoomData();
  }, [roomId]);

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
  const handleExited = () => {
    setMessageInfo(undefined);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className="flex justify-center mt-6 mb-4">
        <Switch onSwitchChange={handleSwitchChange} />
        <Snackbar
          key={messageInfo ? messageInfo.key : undefined}
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          TransitionProps={{ onExited: handleExited }}
          message={messageInfo ? messageInfo.message : undefined}
        />
      </div>
      {/* {loading ? (
        
        // <h1 className="flex justify-center h-4">Loading...</h1>
      ) : (
        <h1 className="flex justify-center h-4"></h1>
      )} */}
      {/* <h1>{selectedOption}</h1> */}
      {selectedOption === "Me" && (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                className="flex justify-center md:mb-6 mb-3"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="max-w-[800px] select-none">
                  {myRankedList
                    .sort((a, b) => a[1] - b[1])
                    .map(([key, value], index) => (
                      <Draggable
                        key={`${key}-${index}`}
                        draggableId={key}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="flex items-center text-2xl p-4 border border-black border-solid rounded-2xl mb-3 mx-3 break-words bg-white"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps} 
                          >
                            <div className="flex items-center mr-2">
                              <div className="grid grid-cols-2 gap-0.5">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              </div>
                            </div>
                            <div className="flex-grow">
                              <strong>{value}</strong>: {key}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {selectedOption !== "Me" && (
        <div className="flex justify-center md:mb-6 mb-2 ">
          <ul className="max-h-[600px] h-[600px] max-w-[500px] overflow-y-auto">
            {opinions
              .sort((a, b) => a[1] - b[1]) // Sort the array by value
              .map(([key, value], index) => (
                <li
                  key={key}
                  className="text-2xl p-4 border border-black border-solid rounded-2xl mb-3 mx-3 break-words "
                >
                  <strong>{index + 1}</strong>: {key}
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
