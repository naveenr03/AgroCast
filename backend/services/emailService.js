import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',  
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPredictionEmail = async (email, predictionData) => {
  try {
    console.log(email);

    console.log(predictionData);
    let weatherMessage = '';
    if (predictionData === 'Sunny') {
      weatherMessage = `
        <p>Dear Farmer,</p>
        <p>We hope this message finds you well. Here is your weather forecast for tomorrow:</p>
        <p><strong>Weather Prediction:</strong> Sunny</p>
        <p style="margin-top: 15px;"><strong>Suggested Actions for Tomorrow:</strong></p>
        <ul>
          <li><strong>Irrigation Needs:</strong> With high sunshine and low humidity, crops may need additional watering. Check soil moisture levels to avoid crop stress.</li>
          <li><strong>Pest Monitoring:</strong> Sunny days may increase pest activity. Consider scouting for pests or applying preventative treatments if necessary.</li>
          <li><strong>Harvesting Opportunity:</strong> Dry conditions make tomorrow ideal for harvesting crops ready for pick-up.</li>
        </ul>
        <p>We hope this helps with your planning, and wish you a productive day on the farm! Feel free to reach out with any questions.</p>
        <p>Warm regards,</p>
        <p><strong>AgroCast</strong></p>`;
    } else if (predictionData === 'Rainy') {
      weatherMessage = `
        <p>Dear Farmer,</p>
        <p>We hope this message finds you well. Here is your weather forecast for tomorrow:</p>
        <p><strong>Weather Prediction:</strong> Rainy</p>
        <p style="margin-top: 15px;"><strong>Suggested Actions for Tomorrow:</strong></p>
        <ul>
          <li><strong>Prepare for Water Management:</strong> Ensure drainage systems are in place to prevent waterlogging in fields, especially for moisture-sensitive crops.</li>
          <li><strong>Delay Irrigation:</strong> It’s advisable to pause irrigation plans to avoid over-watering.</li>
          <li><strong>Protection Measures:</strong> Consider covering sensitive plants or providing support against possible heavy winds.</li>
        </ul>
        <p>We hope this update helps you take necessary precautions and make the most of tomorrow’s weather.</p>
        <p>Kind regards,</p>
        <p><strong>AgroCast</strong></p>`;
    }

    const message = {
      from: process.env.EMAIL_USER,
      to: "madridstanaveen003@gmail.com",
      subject: "Weather Prediction Data",
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${weatherMessage}</div>`,
    };

    await transporter.sendMail(message);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
