import { useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Validation from "./Validation";
import Snackbar from "@mui/material/Snackbar";
import { Input } from "@/components/ui/input";

/**
 * This is the register component that will allow the user to register
 * @returns The registration component
 */
function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [snackPack, setSnackPack] = React.useState([]);
  const [messageInfo, setMessageInfo] = React.useState(undefined);
  const [open, setOpen] = React.useState(false);
  const handleExited = () => {
    setMessageInfo(undefined);
  };
  const handleClose = () => {
    setOpen(false);
  };
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

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username.length > 20) {
      const message = "Please make username less than 20 characters";
      setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
      return;
    }
    if (password === password1) {
      axiosInstance
        .post("/register", { username, password })
        .then((result) => {
          console.log(result);
          navigate("/login");
        })
        .catch((error) => console.log(error));
    } else {
      // show user indication of passowrds not matching
      console.log("passwords do not match");
    }
  };

  const handleValidation = (event) => {
    event.preventDefault();
    setErrors(Validation(username, password, password1));

    // If there are no errors
    if (Object.keys(errors).length === 0) {
      handleSubmit(event);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        message={messageInfo ? messageInfo.message : undefined}
      />
      <div className="bg-white p-4 border rounded-xl shadow-md w-25">
        <h2 className="mb-2 text-2xl">Register</h2>
        <form className="flex flex-col gap-4" onSubmit={handleValidation}>
          <div className="flex items-center mb-1 ">
            <label htmlFor="email" className="mr-2">
              <strong>Username</strong>
            </label>
            <Input
              type="text"
              placeholder="Enter username"
              autoComplete="off"
              name="email"
              className="w-full p-3 text-base"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
          <div className="flex items-center mb-1">
            <label htmlFor="password" className="mr-2">
              <strong>Password</strong>
            </label>
            <Input
              type="password"
              placeholder="Enter password"
              autoComplete="off"
              name="password"
              className="w-full p-3 text-base"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
          <div className="flex items-center mb-1">
            <label htmlFor="password" className="mr-2">
              <strong>Password</strong>
            </label>
            <Input
              type="password"
              placeholder="Enter password"
              autoComplete="off"
              name="password2"
              className="w-full p-3 text-base"
              onChange={(e) => setPassword1(e.target.value)}
            />
          </div>{" "}
          {errors.password1 && (
            <p style={{ color: "red" }}>{errors.password1}</p>
          )}
          <a href="/login">Already have an account?</a>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
