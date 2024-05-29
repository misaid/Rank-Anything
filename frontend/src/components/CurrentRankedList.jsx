import React from "react";
import { useState } from "react";
import Switch from "./button/Button";
import "./button/styles.css";
import "../index.css";

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
const CurrentRankedList = ({ rankedList, rname: roomname, ol: opinons }) => {
  // Convert object to array of key-value pairs

  // console.log("userList: ", rankedList);
  // console.log("Room Id: ", roomname);
  // console.log("Opinions: ", opinons);
  const rankedListArray = Object.entries(rankedList);
  const opinions = Object.entries(opinons);
  const [selectedOption, setSelectedOption] = useState("Me");

  const handleAddition = (event) => {
    event.preventDefault();
  };

  const handleSwitchChange = (option) => {
    setSelectedOption(option);
    console.log("Switched to", option);
  };

  return (
    <div>
      <div className="flex justify-center mt-6 mb-4">
        <Switch onSwitchChange={handleSwitchChange} />
      </div>
      {/* <h1>{selectedOption}</h1> */}

      {selectedOption === "Me" && (
        <div className="flex justify-center mb-10 ">
          <ul className="border border-black border-solid rounded">
            {rankedListArray
              .sort((a, b) => a[1] - b[1]) // Sort the array by value
              .map(([key, value]) => (
                <li key={value}>
                  <strong>{value}</strong>: {key}
                </li>
              ))}
          </ul>
        </div>
      )}

      {selectedOption !== "Me" && (
        <div className="flex justify-center mb-10">
          <ul className="border border-black border-solid rounded">
            {opinions
              .sort((a, b) => a[1] - b[1]) // Sort the array by value
              .map(([key, index]) => (
                <li key={index} className="text-3xl p-4">
                  <strong>{index}</strong>: {key}
                </li>
              ))}
          </ul>
        </div>
      )}

      <div className="w-64 mx-auto">
        <form className="flex flex-col gap-4">
          <div className="flex items-center mb-1 ">
            <input
              type="text"
              placeholder="Add to list"
              autoComplete="off"
              name="email"
              className="w-4/6 px-3 py-2 border-b text-sm border-gray-400  mr-2"
              onSubmit={handleAddition}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CurrentRankedList;
