  /* eslint-disable react/prop-types */
  import axios from 'axios';
  import { getUSerName } from '../../../backend/hooks/GetUserName';

  // eslint-disable-next-line react/prop-types
  const TestML = ({ weatherData }) => {
    const handlePredictWeather = async () => {
      if (!weatherData) {
        alert("No weather data available for prediction.");
        return;
      }

      // Create the payload for the POST request
      const data = {
        date: weatherData.date,            // Pass the formatted date
        mintemp: weatherData.minTemp,      // Min temperature
        maxtemp: weatherData.maxTemp,      // Max temperature
        rainfall: weatherData.rainfall,    // Rainfall in mm
        evaporation: weatherData.evaporation, // Evaporation (calculated)
        sunshine: weatherData.sunshine,    // Sunshine hours
        windgustspeed: weatherData.windGustSpeed, // Wind gust speed in m/s
        humidity9am: weatherData.humidity, // Humidity at 9am
        pressure9am: weatherData.pressure, // Pressure at 9am
        temp9am: weatherData.temp,         // Temperature at 9am
        location: weatherData.location,    // Mapped location index
        cloud9am: weatherData.cloud,       // Cloud scale (0-9)
        windgustdir: weatherData.windGustDir, // Wind gust direction index
        raintoday: weatherData.rainToday === "Yes" ? 1 : 0 // Rain today binary (1 for Yes, 0 for No)
      };


      try {
        // Send the POST request to your weather prediction API
        const response = await axios.post('http://127.0.0.1:5000/predict', data);
        console.log(data);
        const userEmail = getUSerName();
        // Handle the API response
        
        alert(`Predicted Weather: ${response.data.predicted_weather}`);
        
        await axios.post('http://localhost:5000/api/sendPrediction', {
          email: userEmail,
          prediction: response.data.predicted_weather
        });


      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while predicting the weather.');
      }
    };

    return (
      <div>
        <h1>Weather Prediction</h1>
        <button onClick={handlePredictWeather}>Predict Weather</button>
      </div>
    );
  };

  export default TestML;
