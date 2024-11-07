import { useEffect, useState } from "react";
import { getUSerName } from "../../../backend/hooks/GetUserName";
import { useGetUserID } from "../../../backend/hooks/useGetUserID";

const Home = () => {
  const [location, setLocation] = useState("");  

  const userID = window.localStorage.getItem("userID"); 

  useEffect(() => {
    const location = window.localStorage.getItem("location");
    setLocation(location);  
  }, []);  
  console.log("User ID:", userID);  // Debugging step to check userID
  console.log("Location retrieved:", location);  // Debugging step to check if location is retrieved

  return (
    <div>
      <h1>Home</h1>
      <p className="text-red-400 "> {useGetUserID()} </p>
      <p>Welcome back, {getUSerName()}!</p>
      <p>Your location: {location || "Location not available"}</p>
    </div>
  );
};

export default Home;
