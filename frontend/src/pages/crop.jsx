import { useState } from 'react';
import axios from 'axios';

function Crop() {
  const [cropRecommendations, setCropRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchRecommendations = async () => {
    const hardcodedData = {
      location: "Coimbatore", // hardcoded location
      predictionData: {
        temperature: 25,
        rainfall: 80,
        humidity: 70
      }
    };

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/crop-recommendation', hardcodedData);

      if (response.data.success) {
        setCropRecommendations(response.data.recommendations);
      } else {
        setCropRecommendations([]);
      }
    } catch (error) {
      console.error("Error fetching crop recommendations:", error);
      setCropRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-green-800 mb-4">Recommended Crops</h2>
      <p className="mb-4 text-gray-600">Based on weather conditions in Coimbatore</p>
      <button 
        onClick={handleFetchRecommendations} 
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Loading..." : "Get Crop Recommendations"}
      </button>

      {cropRecommendations.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-green-700 mb-2">Suitable Crops:</h3>
          <ul className="list-disc list-inside space-y-2">
            {cropRecommendations.map((crop, index) => (
              <li key={index} className="text-gray-700">{crop}</li> 
            ))}
          </ul>
        </div>
      ) : (
        !loading && (
          <p className="mt-4 text-gray-600 italic">
            No suitable crops found for the given conditions.
          </p>
        )
      )}
    </div>
  );
}

export default Crop;