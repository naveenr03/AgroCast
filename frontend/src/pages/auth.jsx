/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  return (
    <div className="auth flex justify-center items-center h-screen bg-gray-100">
      <Login />
      <Register />
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const [_, setCookie] = useCookies(["access_token"]);

  const validate = () => {
    const errors = {};
    if (!username) errors.username = "Username is required";
    if (!password) errors.password = "Password is required";
    return errors;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/login", { username, password });
      setCookie("access_token", response.data.token);
      window.localStorage.setItem("userID", response.data.userID);
      window.localStorage.setItem("username", response.data.username);
      window.localStorage.setItem("location", response.data.location);
      navigate("/test");
    } catch (error) {
      console.error(error.response);
    }
  };

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Login"
      onSubmit={onSubmit}
      errors={errors}
    />
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!username) errors.username = "Username is required";
    if (!password) errors.password = "Password is required";
    if (!location) errors.location = "Location is required";
    return errors;
  };

  const formatLocation = (loc) => {
    return loc.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formattedLocation = formatLocation(location);
      await axios.post("http://localhost:5000/auth/register", { username, password, location: formattedLocation });

      window.localStorage.setItem("username", username);
      window.localStorage.setItem("location", formattedLocation);
      alert("User registered successfully");
    } catch (error) {
      console.error(error.response);
    }
  };

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      location={location}
      setLocation={setLocation}
      label="Register"
      onSubmit={onSubmit}
      errors={errors}
    />
  );
};

const Form = ({ username, setUsername, password, setPassword, location, setLocation, label, onSubmit, errors }) => {
  return (
    <div className="auth-container bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold mb-4">{label}</h1>
        <div className="form-group mb-4">
          <input
            type="text"
            placeholder="email"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="p-2 border rounded w-full"
          />
          {errors.username && <p className="text-red-500">{errors.username}</p>}
        </div>
        <div className="form-group mb-4">
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="p-2 border rounded w-full"
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>
        {label === "Register" && (
          <div className="form-group mb-4">
            <input
              type="text"
              placeholder="Location"
              id="location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="p-2 border rounded w-full"
            />
            {errors.location && <p className="text-red-500">{errors.location}</p>}
          </div>
        )}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">{label}</button>
      </form>
    </div>
  );
};
