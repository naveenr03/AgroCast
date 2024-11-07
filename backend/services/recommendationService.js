import cropData from "../data/cropData.json" assert { type: "json" };


export default function getCropRecommendations(predictionData, location) {
  // Determine season based on the current month
  const month = new Date().getMonth() + 1; // JavaScript months are zero-indexed, so add 1
  let season;

  if (month >= 6 && month <= 9) {
    season = "kharif"; // June to September
  } else if (month >= 10 && month <= 3) {
    season = "rabi";   // October to March
  } else {
    season = "perennial"; // April, May, or if the crop grows year-round
  }

  console.log(`Current season: ${season}`); // Debugging output

  // Get crop data based on season
  const seasonData = cropData[season.toLowerCase()] || [];
  const { rainfall, temperature } = predictionData;

  console.log(`Prediction Data - Temperature: ${temperature}, Rainfall: ${rainfall}`); // Debugging output

  // Filter crops by matching conditions
  const recommendedCrops = seasonData.filter(crop => {
    // Check if the crop's region, rainfall, and temperature match the prediction data
    const isRegionSuitable = crop.regions.includes(location);
    const isRainfallSuitable = rainfall >= crop.rainfall[0] && rainfall <= crop.rainfall[1];
    const isTemperatureSuitable = temperature >= crop.temperature[0] && temperature <= crop.temperature[1];

    // Debugging output for each crop
    console.log(`Checking crop: ${crop.name}`);
    console.log(`  - Region: ${isRegionSuitable}`);
    console.log(`  - Rainfall: ${isRainfallSuitable}`);
    console.log(`  - Temperature: ${isTemperatureSuitable}`);

    return isRegionSuitable && isRainfallSuitable && isTemperatureSuitable;
  }).map(crop => crop.name); // Map to return only the crop names

  console.log(`Recommended crops: ${recommendedCrops}`); // Debugging output
  return recommendedCrops;
}
