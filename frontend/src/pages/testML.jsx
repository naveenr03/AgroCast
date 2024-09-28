import axios from 'axios'; // Optional: Use fetch instead if you prefer

const TestML = () => {
    const handlePredictWeather = () => {
        // Hardcoded data for testing
        const data = {
            "date": "2024-09-26",
            "mintemp": 25.0,
            "maxtemp": 30.0,
            "rainfall": 0.0,
            "evaporation": 5.0,
            "sunshine": 10.0,
            "windgustspeed": 5.0,
            "humidity9am": 50.0,
            "pressure9am": 1015.0,
            "temp9am": 26.0,
            "location": 3,
            "cloud9am": 1.0,
            "windgustdir": 180.0,
            "raintoday": 0.0
        };


        axios.post('http://127.0.0.1:5000/predict', data)
            .then(response => {
                alert(`Predicted Weather: ${response.data.predicted_weather}`);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while predicting the weather.');
            });
    };

    return (
        <div>
            <h1>Weather Prediction</h1>
            <button onClick={handlePredictWeather}>Predict Weather</button>
        </div>
    );
};

export default TestML;