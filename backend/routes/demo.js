// cropRecommendationRouter.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

const router = express.Router();

// Configure API keys
const GOOGLE_API_KEY = "AIzaSyAnxkMcwtAf8YTHzQSQnrwPfeuCiXr_dvQ";
const WEATHER_API_KEY = "92604b2341b43dd2a6e27134d9c82e22";

// Check if API keys are missing
if (!GOOGLE_API_KEY || !WEATHER_API_KEY) {
  throw new Error("Missing API keys. Please check your .env file");
}

// Configure Gemini API
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// OpenWeatherMap configuration
const WEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5/weather";

// Helper Functions
const getWeatherData = async (location) => {
  try {
    const response = await axios.get(WEATHER_BASE_URL, {
      params: {
        q: location,
        appid: WEATHER_API_KEY,
        units: "metric",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Invalid API key");
    } else if (error.response?.status === 404) {
      throw new Error(`Location '${location}' not found`);
    }
    throw error;
  }
};

const getTNAgroZone = (location) => {
  const zones = {
    "North Eastern": [
      "Kanchipuram",
      "Chengalpet",
      "Tiruvallur",
      "Cuddalore",
      "Villupuram",
      "Kallakuruchi",
      "Vellore",
      "Tirupathur",
      "Ranipet",
      "Tiruvannamalai",
    ],
    "North Western": ["Dharmapuri", "Salem", "Namakkal"],
    Western: ["Erode", "Coimbatore", "Karur", "Dindigul", "Theni"],
    "Cauvery Delta": [
      "Tiruchi",
      "Perambalur",
      "Pudukottai",
      "Thanjavur",
      "Nagapattinam",
      "Mayiladuthurai",
      "Tiruvarur",
    ],
    Southern: [
      "Madurai",
      "Sivagangai",
      "Ramanathapuram",
      "Virudhunagar",
      "Tirunelveli",
      "Tenkasi",
      "Thoothukudi",
    ],
    "High Rainfall": ["Kanniyakumari"],
    Hilly: ["Nilgiris", "Kodaikanal"],
  };

  for (const [zone, districts] of Object.entries(zones)) {
    if (
      districts.some((district) =>
        location.toLowerCase().includes(district.toLowerCase())
      )
    ) {
      return zone;
    }
  }
  return "Unknown";
};

const getTNSeason = (monthNum) => {
  if (monthNum >= 3 && monthNum <= 5) return "Summer";
  if (monthNum >= 6 && monthNum <= 11) return "Monsoon";
  return "Winter";
};

const getTNSeasonalData = (season) => {
  const seasonalData = {
    Summer: {
      crops: {
        rice: ["ADT 36", "ADT 43", "CO 51"],
        pulses: ["black gram", "green gram"],
        millets: ["pearl millet", "finger millet"],
        oilseeds: ["groundnut", "sesame", "sunflower"],
        vegetables: ["tomato", "brinjal", "bhendi", "chilli"],
      },
      crop_protection: {
        common_pests: ["shoot fly", "stem borer", "thrips", "leaf miner"],
        diseases: ["blast", "blight", "powdery mildew"],
        prevention: [
          "summer ploughing",
          "seed treatment",
          "proper irrigation",
          "mulching",
        ],
      },
      farming_practices: [
        "soil moisture conservation",
        "drip irrigation",
        "mulching",
        "early morning irrigation",
        "shade management",
      ],
    },
    Monsoon: {
      crops: {
        rice: ["CR 1009", "ADT 38", "IR 64", "CO 43"],
        cotton: ["MCU 5", "SVPR 4", "TCH 1819"],
        sugarcane: ["CO 86032", "COC 24", "COC 25"],
        pulses: ["red gram", "black gram"],
        millets: ["sorghum", "pearl millet"],
        oilseeds: ["groundnut", "gingelly"],
      },
      crop_protection: {
        common_pests: [
          "stem borer",
          "leaf folder",
          "brown planthopper",
          "bollworm",
        ],
        diseases: ["blast", "blight", "rust", "wilt"],
        prevention: [
          "proper drainage",
          "resistant varieties",
          "timely pest monitoring",
          "prophylactic spraying",
        ],
      },
      farming_practices: [
        "rainwater harvesting",
        "drainage management",
        "pest monitoring",
        "nutrient management",
        "weed control",
      ],
    },
    Winter: {
      crops: {
        rice: ["TRY 3", "ADT 39", "CO 52"],
        pulses: ["horse gram", "cowpea"],
        oilseeds: ["sunflower", "safflower"],
        vegetables: ["cabbage", "cauliflower", "carrot", "beetroot"],
      },
      crop_protection: {
        common_pests: ["aphids", "diamond back moth", "pod borer"],
        diseases: ["powdery mildew", "leaf spot", "rust"],
        prevention: [
          "proper spacing",
          "balanced nutrition",
          "timely weeding",
          "appropriate irrigation",
        ],
      },
      farming_practices: [
        "protected cultivation",
        "soil testing",
        "micro-irrigation",
        "crop rotation",
        "integrated nutrient management",
      ],
    },
  };
  return seasonalData[season] || {};
};

// API Endpoint for Crop Recommendations
router.post("/crop-recommendations", async (req, res) => {
  try {
    const { location, crops, language = "English" } = req.body;

    if (!location || !crops || !Array.isArray(crops)) {
      return res.status(400).json({
        error: "Invalid input. Please provide location and crops array",
      });
    }

    // Get weather data
    const weatherData = await getWeatherData(location);

    // Get current season
    const currentMonth = new Date().getMonth() + 1;
    const currentSeason = getTNSeason(currentMonth);
    const agroZone = getTNAgroZone(location);

    // Get seasonal data
    const seasonalData = getTNSeasonalData(currentSeason);

    // Prepare prompt for Gemini
    const prompt = `Provide targeted agricultural recommendations for Tamil Nadu farmers in ${language} based on current weather and location data.

**Location:** ${location}
**Agro-climatic Zone:** ${agroZone} 
**Season:** ${currentSeason}
**Temperature:** ${weatherData.main.temp}°C
**Humidity:** ${weatherData.main.humidity}%
**Weather:** ${weatherData.weather[0].description}

**Recommended Crops:** ${Object.values(seasonalData.crops || {})
      .flat()
      .join(", ")}

**Crop Protection Measures**
- **Pests:** ${seasonalData.crop_protection?.common_pests.join(", ")}
- **Diseases:** ${seasonalData.crop_protection?.diseases.join(", ")}
- **Prevention:** ${seasonalData.crop_protection?.prevention.join(", ")}

**Farming Practices:** ${seasonalData.farming_practices?.join(", ")}

For crops (${crops.join(", ")}), include:
1. Suitable varieties for ${agroZone} in ${currentSeason}.
2. Protection measures based on current conditions.
3. Best practices for this season in Tamil Nadu.
4. Water management based on current temperature and humidity.
5. Expected market trends.
`;

    // Get recommendations from Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({
      weather: weatherData,
      recommendations: response.text(),
      season: currentSeason,
      agro_zone: agroZone,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Export the router
export { router as cropRecommendationRouter };
