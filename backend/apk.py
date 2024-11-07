import pickle
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# Get the current directory of the script
current_dir = os.path.dirname(__file__)

# Construct the full path to the model file
model_path = os.path.join(current_dir, "ml_model/catml.pkl")

# Load the model
model = pickle.load(open(model_path, "rb"))
print("Model Loaded")

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():

    data = request.get_json()

    required_fields = ['date', 'mintemp', 'maxtemp', 'rainfall', 'evaporation', 
                       'sunshine', 'windgustspeed', 'humidity9am', 
                       'pressure9am', 'temp9am', 'location', 
                       'cloud9am', 'windgustdir', 'raintoday']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    input_lst = [
        data['location'],
        data['mintemp'],
        data['maxtemp'],
        data['rainfall'],
        data['evaporation'],
        data['sunshine'],
        data['windgustdir'],
        data['windgustspeed'],
        data['humidity9am'],
        data['pressure9am'],
        data['cloud9am'],
        data['temp9am'],
        data['raintoday'],
        float(pd.to_datetime(data['date']).month),
        float(pd.to_datetime(data['date']).day)
    ]

   
    pred = model.predict([input_lst])[0]

    
    weather_condition = "Sunny" if pred == 0 else "Rainy"

    return jsonify({"predicted_weather": weather_condition})

if __name__ == '__main__':
    app.run(debug=True)