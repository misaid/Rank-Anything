import React, { useEffect, useState } from "react";
import Switch from "./button/Button";
import "./button/styles.css";
import "../index.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
/**
 * This function is the current ranked list component
 * It displays the current ranked list of items and the opinions of the user
 * it also allows for users to switch between the ranked list and the opinions
 * it also allows for users to change and submit ther opinions
 * @param {*} udata
 * The user data (static) we are only using userId from this
 * @returns
 * The current ranked list component
 */
const CurrentRankedList = ({ udata }) => {
  // needed to make the call to the backend
  const defaultRoomId = "test";
  let { roomId = defaultRoomId } = useParams();

  const user = udata.userId;

  const [loading, setLoading] = useState(false);
  const [creator, setCreator] = useState("");
  const [myRankedList, setMyRankedList] = useState([]);
  const [opinions, setOpinions] = useState([]);

  // only in the componnent itself
  const [item, setItem] = useState("");
  const [selectedOption, setSelectedOption] = useState("Me");
  const navigate = useNavigate();

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(myRankedList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setMyRankedList(items);
  }

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
      console.log(avgOpinion);
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

  /**
   * Handles the addition of an item to the ranked list
   * @param {*} event
   * The event that triggers the function
   * @returns
   * null
   * */
  const handleAddition = async (event) => {
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

  /**
   * Handles the deletion of an item from the ranked list
   * @param {*} event
   * The event that triggers the function
   * @returns
   * null
   * */
  const handleDelete = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.delete(
        `http://localhost:5555/room${roomId}/item`,
        {
          data: { item: item },
          withCredentials: true,
        }
      );
      fetchRoomData();
      setItem("");
    } catch (error) {
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
      {loading ? (
        <h1 className="flex justify-center text-xs">Loading...</h1>
      ) : (
        <h1 className="flex justify-center h-4"></h1>
      )}
      {/* <h1>{selectedOption}</h1> */}
      {selectedOption === "Me" && (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                className="flex justify-center mb-6 "
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <ul className="max-h-[600px] max-w-[800px] h-[600px] overflow-y-scroll">
                  {myRankedList
                    .sort((a, b) => a[1] - b[1])
                    .map(([key, value], index) => (
                      <Draggable
                        key={`${key}-${index}`}
                        draggableId={key}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            className="border border-black border-solid rounded-xl mb-2 mx-2 text-l p-3 bg-white"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <strong>{value}</strong>: {key}
                          </li>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {selectedOption !== "Me" && (
        <div className="flex justify-center mb-6 ">
          <ul className="max-h-[600px] max-w-[500px] overflow-y-scroll">
            {opinions
              .sort((a, b) => a[1] - b[1]) // Sort the array by value
              .map(([key, value]) => (
                <li
                  key={key}
                  className="text-3xl p-4 border border-black border-solid rounded-3xl mb-3 mx-3 break-words "
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
