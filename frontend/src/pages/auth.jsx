/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import { useNavigate } from "react-router-dom";


export const Auth = () => {
  return (
    <div className="auth">
      <Login />
      <Register />
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [_, setCookie] = useCookies(["access_token"]);

  const onSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {username, password});
      setCookie("access_token", response.data.token);
      window.localStorage.setItem("userID", response.data.userID);
      navigate("/");
    }
    catch (error) {
      console.error(error.response.data);
    }
  }
    

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Login"
      onSubmit={onSubmit}
    />
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event) => { 
    event.preventDefault();
  
    try {
      await axios.post("http://localhost:5000/auth/register", { username, password });
      alert("User registered successfully"); 
    }
    catch (error) {
      console.error(error.response.data);
    }
  }

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Register"
      onSubmit= {onSubmit}  
    />
  );
};


const Form = ({ username, setUsername, password, setPassword, label, onSubmit }) => {
  return (
    <div className="auth-container">
      <form onSubmit={onSubmit}>
        <h1>{label}</h1>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">{label}</button>
      </form>
    </div>
  );
};
