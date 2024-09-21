import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/users.js';
import { WeatherRouter } from './services/weatherService.js';
import connectDB from './config/db.js'
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/auth', userRouter);
app.use('/api', WeatherRouter);

app.listen(5000, () => {
    console.log('Server started on http://localhost:5000');
    }
);



