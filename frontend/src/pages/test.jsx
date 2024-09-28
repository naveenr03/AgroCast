import { useState } from "react";
import axios from "axios";

const Test = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("");

//eslint-disable-next-line
  const fetchWeather = async (e) => {

    event.preventDefault();
    try {
      const response = await axios.get("http://localhost:5000/api/weather", {
        params: {
          location: location,
        },
      });
      setWeatherData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };


 
  

  return (
    <div>
      <form onSubmit={fetchWeather}>
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button type="submit">Get Weather</button>
        </label>
      </form>

      {weatherData ? (
        <div>
          <h1>Weather in {weatherData.name}</h1>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Feels like: {weatherData.main.feels_like}°C</p>
          <p>Min Temperature: {weatherData.main.temp_min}°C</p>
          <p>Max Temperature: {weatherData.main.temp_max}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Pressure: {weatherData.main.pressure} hPa</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          <p>
            Wind Gust Speed:{" "}
            {weatherData.wind.gust ? weatherData.wind.gust + " m/s" : "N/A"}
          </p>
          <p>Wind Direction: {weatherData.wind.deg}°</p>
          <p>Cloudiness: {weatherData.clouds.all}%</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <p>
            Rainfall (last 1h):{" "}
            {weatherData.rain ? weatherData.rain["1h"] + " mm" : "N/A"}
          </p>
          <p>
            Sunshine (inferred from description):{" "}
            {weatherData.weather[0].description.includes("clear")
              ? "Yes"
              : "No"}
          </p>
          <p>Rain Today: {weatherData.rain ? "Yes" : "No"}</p>
          <p>Date: {new Date(weatherData.dt * 1000).toLocaleDateString()}</p>
          <p> description : {weatherData.weather[0].description} </p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default Test;
