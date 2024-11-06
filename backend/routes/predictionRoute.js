import express from 'express';
import { sendPredictionEmail } from '../services/emailService.js';

const router = express.Router();

router.post('/sendPrediction', async (req, res) => {
    const { email, prediction } = req.body;
    
    try {
        await sendPredictionEmail(email, prediction);
        res.json({ message: "Prediction email sent successfully." });
    } catch (error) {
        console.error("Error sending prediction email:", error);
        res.status(500).json({ error: "Error sending prediction email." });
    }
    });


    export { router as predictionRouter };

