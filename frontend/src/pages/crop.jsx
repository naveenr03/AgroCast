import { useState } from 'react';
import axios from 'axios';

function CropRecommendation() {
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
        setCropRecommendations(response.data.recommendations); // Set the recommendations in state
      } else {
        setCropRecommendations([]); // If no recommendations found, clear the list
      }
    } catch (error) {
      console.error("Error fetching crop recommendations:", error);
      setCropRecommendations([]); // Clear list in case of error
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div>
      <h3>Recommended Crops</h3>
      <button onClick={handleFetchRecommendations} disabled={loading}>
        {loading ? "Loading..." : "Get Crop Recommendations"}
      </button>

      {cropRecommendations.length > 0 ? (
        <ul>
          {cropRecommendations.map((crop, index) => (
            <li key={index}>{crop}</li> 
          ))}
        </ul>
      ) : (
        !loading && <p>No suitable crops found for the given conditions.</p> // Display if no crops are found
      )}
    </div>
  );
}

export default CropRecommendation;
