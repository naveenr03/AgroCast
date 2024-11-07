/* eslint-disable react/prop-types */
import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function CropRecommendation() {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    const requestData = {
      location: "Chennai",
      crops: ["rice", "cotton"],
      language: "English"
    };

    try {
      const response = await axios.post('http://localhost:5000/api/crop-recommendations', requestData);
      setRecommendations(response.data);
    } catch (error) {
      console.error("Error fetching crop recommendations:", error);
      setError("Failed to fetch crop recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-green-800 mb-4">Crop Recommendations</h2>
      <button 
        onClick={handleFetchRecommendations} 
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        {loading ? "Fetching Recommendations..." : "Get Crop Recommendations"}
      </button>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {recommendations && (
        <div className="space-y-6">
          <WeatherInfo weather={recommendations.weather} />
          <RecommendationsContent recommendations={recommendations.recommendations} />
        </div>
      )}
    </div>
  );
}

function WeatherInfo({ weather }) {
  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <h3 className="text-xl font-semibold text-green-800 mb-2">Current Weather in {weather.name}</h3>
      <div className="grid grid-cols-2 gap-4">
        <InfoItem label="Temperature" value={`${weather.main.temp}°C`} />
        <InfoItem label="Humidity" value={`${weather.main.humidity}%`} />
        <InfoItem label="Wind Speed" value={`${weather.wind.speed} m/s`} />
        <InfoItem label="Weather" value={weather.weather[0].description} />
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <span className="font-medium text-green-700">{label}:</span> {value}
    </div>
  );
}

function RecommendationsContent({ recommendations }) {
  return (
    <div className="prose prose-green max-w-none">
      <ReactMarkdown>{recommendations}</ReactMarkdown>
    </div>
  );
}

export default CropRecommendation;