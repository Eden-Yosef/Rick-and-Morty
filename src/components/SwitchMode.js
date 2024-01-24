import React from "react";
import "./SwitchMode.css";
import { useDispatch, useSelector } from "react-redux";
import { setDarkMode } from "../redux/actions";

const SwitchMode = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.darkMode);

  const handleDarkModeToggle = () => {
    dispatch(setDarkMode(!darkMode));
  };

  return (
    <label className="switch-container">
      <input
        type="checkbox"
        onChange={handleDarkModeToggle}
        checked={darkMode}
      />
      <span className="slider"></span>
    </label>
  );
};

export default SwitchMode;
