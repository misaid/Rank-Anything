import React from "react";

const CurrentRankedList = ({ rankedList }) => {
  // Convert object to array of key-value pairs
  const rankedListArray = Object.entries(rankedList);

  return (
    <div>
      <h2>Current Ranked List:</h2>
      <ul>
        {rankedListArray.map(([key, value]) => (
          <li key={value}>
            <strong>{value}</strong>: {key}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CurrentRankedList;
