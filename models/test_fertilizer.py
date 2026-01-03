import requests
import json

# Test fertilizer prediction endpoint with both formats
url = "http://localhost:5000/predict_fertilizer"

print("=" * 60)
print("Testing Fertilizer Prediction API")
print("=" * 60)

# Test 1: String inputs (as user requested)
print("\n1. Testing with STRING inputs (sandy, maize):")
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

try:
    response = requests.post(url, json=data_string)
    print(f"   Status Code: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=4)}")
except Exception as e:
    print(f"   Error: {e}")

# Test 2: Integer inputs (original format)
print("\n2. Testing with INTEGER inputs (1, 1):")
data_int = {
    "temp": 26,
    "humidity": 52,
    "moisture": 38,
    "soil_type": 1,
    "crop_type": 1,
    "nitrogen": 37,
    "potassium": 0,
    "phosphorus": 0
}

try:
    response = requests.post(url, json=data_int)
    print(f"   Status Code: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=4)}")
except Exception as e:
    print(f"   Error: {e}")

# Test 3: Mixed case string inputs
print("\n3. Testing with MIXED CASE strings (Loamy, Sugarcane):")
data_mixed = {
    "temp": 30,
    "humidity": 60,
    "moisture": 40,
    "soil_type": "Loamy",
    "crop_type": "Sugarcane",
    "nitrogen": 20,
    "potassium": 10,
    "phosphorus": 15
}

try:
    response = requests.post(url, json=data_mixed)
    print(f"   Status Code: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=4)}")
except Exception as e:
    print(f"   Error: {e}")

# Test 4: Invalid string input
print("\n4. Testing with INVALID string input:")
data_invalid = {
    "temp": 26,
    "humidity": 52,
    "moisture": 38,
    "soil_type": "invalid_soil",
    "crop_type": "maize",
    "nitrogen": 37,
    "potassium": 0,
    "phosphorus": 0
}

try:
    response = requests.post(url, json=data_invalid)
    print(f"   Status Code: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=4)}")
except Exception as e:
    print(f"   Error: {e}")

print("\n" + "=" * 60)
