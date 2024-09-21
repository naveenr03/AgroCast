// backend/routes/weatherRoutes.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/weather', async (req, res) => {
  const { location } = req.query;
  const API_KEY = process.env.VITE_API_KEY;


  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: location,
          appid: API_KEY,
          units: "metric",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

export {router as WeatherRouter}; 
