/* eslint-disable react/prop-types */
import { useState } from 'react';
import axios from 'axios';
import { getUSerName } from '../../../backend/hooks/GetUserName';

const TestML = ({ weatherData }) => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handlePredictWeather = async () => {
    if (!weatherData) {
      alert("No weather data available for prediction.");
      return;
    }

    setLoading(true);

    const data = {
      date: weatherData.date,
      mintemp: weatherData.minTemp,
      maxtemp: weatherData.maxTemp,
      rainfall: weatherData.rainfall,
      evaporation: weatherData.evaporation,
      sunshine: weatherData.sunshine,
      windgustspeed: weatherData.windGustSpeed,
      humidity9am: weatherData.humidity,
      pressure9am: weatherData.pressure,
      temp9am: weatherData.temp,
      location: weatherData.location,
      cloud9am: weatherData.cloud,
      windgustdir: weatherData.windGustDir,
      raintoday: weatherData.rainToday === "Yes" ? 1 : 0
    };

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', data);
      console.log(data);
      const userEmail = getUSerName();
      
      setPrediction(response.data.predicted_weather);
      
      await axios.post('http://localhost:5000/api/sendPrediction', {
        email: userEmail,
        prediction: response.data.predicted_weather
      });

    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while predicting the weather.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-green-800 mb-4">Weather Prediction</h2>
      <button 
        onClick={handlePredictWeather}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
      >
        {loading ? "Predicting..." : "Predict Weather"}
      </button>
      {prediction && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <p className="text-lg font-medium text-green-800">
            Predicted Weather: <span className="font-bold">{prediction}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default TestML;