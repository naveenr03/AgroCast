import { useEffect, useState } from "react";
import { getUSerName } from "../../../backend/hooks/GetUserName";

const Home = () => {
  const [location, setLocation] = useState("");
  const username = getUSerName();

  useEffect(() => {
    const storedLocation = window.localStorage.getItem("location");
    setLocation(storedLocation);
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-green-800 mb-4">Welcome to AgroCast</h1>
      <div className="space-y-4">
        <p className="text-lg">Welcome back, <span className="font-semibold text-green-700">{username}</span>!</p>
        <p className="text-lg">Your location: <span className="font-semibold text-green-700">{location || "Location not available"}</span></p>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/weather" className="bg-green-100 hover:bg-green-200 p-4 rounded-lg text-center">
            <span className="text-lg font-semibold text-green-800">Check Weather</span>
          </a>
          <a href="/crop" className="bg-green-100 hover:bg-green-200 p-4 rounded-lg text-center">
            <span className="text-lg font-semibold text-green-800">Crop Recommendations</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;