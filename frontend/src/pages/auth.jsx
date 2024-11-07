/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-green-900">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </h2>
        </div>
        {isLogin ? <Login /> : <Register />}
        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-green-600 hover:text-green-500"
          >
            {isLogin ? "Need an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [_, setCookie] = useCookies(["access_token"]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/auth/login", { username, password });
      setCookie("access_token", response.data.token);
      window.localStorage.setItem("userID", response.data.userID);
      window.localStorage.setItem("username", response.data.username);
      window.localStorage.setItem("location", response.data.location);
      navigate("/home");
    } catch (error) {
      console.error(error.response);
      setError("Invalid credentials. Please try again.");
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
      error={error}
    />
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event) => { 
    event.preventDefault();
    setError("");
  
    try {
      await axios.post("http://localhost:5000/auth/register", { username, password, location });
      window.localStorage.setItem("username", username);
      window.localStorage.setItem("location", location);
      alert("User registered successfully. Please login."); 
    } catch (error) {
      console.error(error.response);
      setError("Registration failed. Please try again.");
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
      error={error}
    />
  );
};

const Form = ({ username, setUsername, password, setPassword, location, setLocation, label, onSubmit, error }) => {
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <input type="hidden" name="remember" value="true" />
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="username" className="sr-only">Email address</label>
          <input
            id="username"
            name="username"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {label === "Register" && (
          <div>
            <label htmlFor="location" className="sr-only">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {label}
        </button>
      </div>
    </form>
  );
};

export default Auth;