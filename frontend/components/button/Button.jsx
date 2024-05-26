/**
 * Button component
 * Forked from https://codesandbox.io/p/sandbox/custom-react-switch-zj3in7?file=%2Fsrc%2FApp.tsx%3A15%2C5-15%2C29&from-embed=
 */
import React, { useState } from "react";
import "./styles.css";

const OPTION1 = "Me";
const OPTION2 = "All";

const Switch = ({ onSwitchChange }) => {
  const [last, setLast] = useState(null);
  const [activeOption, setActiveOption] = useState(OPTION1);
  const handleSwitchClick = (option) => {
    setActiveOption(option);
    onSwitchChange(option); // Notify parent of the change
  };

  return (
    <div className="SwitchContainer">
      <div
        className="ToggleItem"
        style={{
          backgroundColor: activeOption === OPTION1 ? "grey" : "transparent",
        }}
        onClick={() => handleSwitchClick(OPTION1)}
      >
        <div className="Text">{OPTION1}</div>
      </div>
      <div
        className="ToggleItem"
        style={{
          backgroundColor: activeOption === OPTION2 ? "grey" : "transparent",
        }}
        onClick={() => handleSwitchClick(OPTION2)}
      >
        <div className="Text">{OPTION2}</div>
      </div>
    </div>
  );
};

export default Switch;
