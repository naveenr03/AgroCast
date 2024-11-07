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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userLocation = window.localStorage.getItem("location");
    console.log(userLocation);
    if (userLocation) {
      setLocation(userLocation);
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

  const fetchWeather = async () => {
    const locationIndex = locationMapping[location];

    if (locationIndex === undefined) {
      alert("Invalid location. Please enter a valid location.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/weather", {
        params: { location: location },
      });
      const data = response.data;

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
      console.log(formattedData); 
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-green-800 mb-4">Weather Data for {location}</h1>
      <button 
        onClick={fetchWeather}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 mb-4"
      >
        {loading ? "Fetching..." : "Fetch Weather Data"}
      </button>

      {weatherData ? (
        <div className="mt-6 space-y-4">
          <h2 className="text-2xl font-semibold text-green-800 border-b border-green-200 pb-2">Weather in {location}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WeatherItem label="Min Temp" value={`${weatherData.minTemp}°C`} />
            <WeatherItem label="Max Temp" value={`${weatherData.maxTemp}°C`} />
            <WeatherItem label="Rainfall" value={`${weatherData.rainfall} mm`} />
            <WeatherItem label="Evaporation" value={weatherData.evaporation} />
            <WeatherItem label="Sunshine" value={`${weatherData.sunshine} hours`} />
            <WeatherItem label="Wind Gust Direction Index" value={weatherData.windGustDir} />
            <WeatherItem label="Wind Gust Speed" value={`${weatherData.windGustSpeed} m/s`} />
            <WeatherItem label="Humidity" value={`${weatherData.humidity}%`} />
            <WeatherItem label="Pressure" value={`${weatherData.pressure} hPa`} />
            <WeatherItem label="Cloud (0-9 scale)" value={weatherData.cloud} />
            <WeatherItem label="Temperature" value={`${weatherData.temp}°C`} />
            <WeatherItem label="Rain Today" value={weatherData.rainToday} />
            <WeatherItem label="Date" value={weatherData.date} />
          </div>
          <div className="mt-6">
            <TestML weatherData={weatherData} />
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Click the button to load weather data.</p>
      )}
    </div>
  );
};

const WeatherItem = ({ label, value }) => (
  <div className="bg-green-100 p-4 rounded-lg">
    <p className="font-semibold text-green-800 mb-1">{label}:</p>
    <p className="text-gray-700">{value}</p>
  </div>
);

export default Test;