import requests
import json

# Simple test to see exact error
url = "http://localhost:5000/predict_fertilizer"

data_string = {
    "temp": 26,
    "humidity": 52,
    "moisture": 38,
    "soil_type": "sandy",
    "crop_type": "maize",
    "nitrogen": 37,
    "potassium": 0,
    "phosphorus": 0
}

print("Testing with string inputs:")
print(f"Sending: {json.dumps(data_string, indent=2)}")

try:
    response = requests.post(url, json=data_string)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
