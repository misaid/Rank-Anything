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
        <div className="flex justify-center ">
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
        <div className="flex justify-center">
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
    </div>
  );
};

export default CurrentRankedList;
