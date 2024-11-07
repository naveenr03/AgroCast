// recommendationService.js
import express from 'express';
import getCropRecommendations from '../services/recommendationService.js';

const router = express.Router();

router.post('/crop-recommendation', (req, res) => {
    const { location, predictionData } = req.body;

    // Basic input validation
    if (!location || !predictionData) {
        return res.status(400).json({ success: false, message: "Location and prediction data are required." });
    }

    try {
        // Call the crop recommendation service with the prediction data and location
        const recommendations = getCropRecommendations(predictionData, location);

        // Check if recommendations are found
        if (recommendations.length === 0) {
            return res.status(404).json({ success: false, message: "No suitable crop recommendations found." });
        }

        // Send back the successful response with recommendations
        res.status(200).json({ success: true, recommendations });
    } catch (error) {
        // Log and handle the error
        console.error("Error fetching crop recommendations:", error);
        res.status(500).json({ success: false, message: "Failed to fetch crop recommendations." });
    }
});

export { router as recommendationRouter };
