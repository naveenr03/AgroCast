import { useState, useEffect } from "react";
import axios from "axios";
import TestML from "./testML";

const windgustdir = {
  'NNW': 0, 'NW': 1, 'WNW': 2, 'N': 3, 'W': 4, 'WSW': 5, 'NNE': 6, 'S': 7, 'SSW': 8,
  'SW': 9, 'SSE': 10, 'NE': 11, 'SE': 12, 'ESE': 13, 'ENE': 14, 'E': 15
};

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}

const degreesToCompass = (deg) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
};

const Test = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("");

  useEffect(() => {
    const userLocation = window.localStorage.getItem("location");
    console.log("Retrieved location:", userLocation);
    if (userLocation) {
      const formattedLocation = userLocation.charAt(0).toUpperCase() + userLocation.slice(1).toLowerCase();
      setLocation(formattedLocation);
      fetchWeather(formattedLocation);
    }
  }, []);

  const locationMapping = {
    'Neyveli': 0, 'Nagapattinam': 1, 'Theni': 2, 'Pudukkottai': 3, 'Vellore': 4,
    'Thiruvarur': 5, 'Virudhunagar': 6, 'Krishnagiri': 7, 'Tiruchirappalli': 8,
    'Pollachi': 9, 'Erode': 10, 'Cuddalore': 11, 'Perambalur': 12, 'Hosur': 13,
    'Mayiladuthurai': 14, 'Dindigul': 15, 'Rajapalayam': 16, 'Tiruppur': 17,
    'Pallavaram': 18, 'Kancheepuram': 19, 'Aruppukottai': 20, 'Vaniyambadi': 21,
    'Karaikkudi': 22, 'Ramanathapuram': 23, 'Tiruvannamalai': 24, 'Tambaram': 25,
    'Chennai': 26, 'Sirkali': 27, 'Thoothukudi': 28, 'Coimbatore': 29, 'Villupuram': 30,
    'Thanjavur': 31, 'Namakkal': 32, 'Gudiyatham': 33, 'Sivakasi': 34, 'Karur': 35,
    'Arakkonam': 36, 'Nagercoil': 37, 'Kanyakumari': 38, 'Sankarankovil': 39, 
    'Tiruvallur': 40, 'Kumbakonam': 41, 'Tambaramm': 42, 'Madurai': 43, 'Avadi': 44,
    'Thirumangalam': 45, 'Tenkasi': 46, 'Chengalpattu': 47
  };

  const fetchWeather = async (formattedLocation) => {
    const locationIndex = locationMapping[formattedLocation];

    if (locationIndex === undefined) {
      alert("Invalid location. Please enter a valid location.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/weather", {
        params: { location: formattedLocation },
      });
      const data = response.data;
      console.log("Weather data fetched:", data);

      const windDirection = degreesToCompass(data.wind.deg);
      const windDirectionIndex = windgustdir[windDirection] || "N/A"; 

      const cloudiness = data.clouds.all;
      const sunshine = 14.5 * (1 - cloudiness / 100);
      const cloudScale = (cloudiness / 100) * 9;
      const temp = data.main.temp;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;

      const dewPoint = temp - ((100 - humidity) / 5);
      let evaporation = ((temp - dewPoint) / 30) * (1 - humidity / 100) + (windSpeed / 10);
      evaporation = evaporation > 0 ? evaporation.toFixed(1) : 0.0;

      const formattedData = {
        date: getDate(),
        minTemp: data.main.temp_min,
        maxTemp: data.main.temp_max,
        rainfall: data.rain ? data.rain["1h"] || 0 : 0, 
        evaporation: evaporation,
        sunshine: sunshine.toFixed(1),
        windGustSpeed: data.wind.gust || "N/A",
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        temp: data.main.temp,
        location: locationIndex,
        cloud: cloudScale.toFixed(1),
        windGustDir: windDirectionIndex, 
        rainToday: data.rain ? "Yes" : "No",
      };

      setWeatherData(formattedData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <div>
      <h1>Weather Data for {location}</h1>

      {weatherData ? (
        <div>
          <h1>Weather in {location}</h1>
          <p>Min Temp: {weatherData.minTemp}°C</p>
          <p>Max Temp: {weatherData.maxTemp}°C</p>
          <p>Rainfall: {weatherData.rainfall} mm</p>
          <p>Evaporation: {weatherData.evaporation}</p>
          <p>Sunshine: {weatherData.sunshine} hours</p>
          <p>Wind Gust Direction Index: {weatherData.windGustDir}</p>
          <p>Wind Gust Speed: {weatherData.windGustSpeed} m/s</p>
          <p>Humidity: {weatherData.humidity}%</p>
          <p>Pressure: {weatherData.pressure} hPa</p>
          <p>Cloud (0-9 scale): {weatherData.cloud}</p>
          <p>Temperature: {weatherData.temp}°C</p>
          <p>Rain Today: {weatherData.rainToday}</p>
          <p>Date: {weatherData.date}</p>
          <TestML weatherData={weatherData} />
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default Test;
