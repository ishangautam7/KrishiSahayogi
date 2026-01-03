import requests
import json

url = "http://localhost:5000/predict_fertilizer"

# Test with string inputs
test_cases = [
    {
        "name": "String inputs (sandy, maize)",
        "data": {
            "temp": 26,
            "humidity": 52,
            "moisture": 38,
            "soil_type": "sandy",
            "crop_type": "maize",
            "nitrogen": 37,
            "potassium": 0,
            "phosphorus": 0
        }
    },
    {
        "name": "Integer inputs (0, 0)",
        "data": {
            "temp": 26,
            "humidity": 52,
            "moisture": 38,
            "soil_type": 0,
            "crop_type": 0,
            "nitrogen": 37,
            "potassium": 0,
            "phosphorus": 0
        }
    },
    {
        "name": "Mixed case (Loamy, Sugarcane)",
        "data": {
            "temp": 29,
            "humidity": 52,
            "moisture": 45,
            "soil_type": "Loamy",
            "crop_type": "Sugarcane",
            "nitrogen": 12,
            "potassium": 0,
            "phosphorus": 36
        }
    }
]

print("=" * 70)
print(" FERTILIZER RECOMMENDATION API - FINAL VERIFICATION")
print("=" * 70)

for i, test in enumerate(test_cases, 1):
    print(f"\n{'='*70}")
    print(f"Test {i}: {test['name']}")
    print(f"{'='*70}")
    
    try:
        response = requests.post(url, json=test['data'])
        result = response.json()
        
        if result.get('success'):
            print(f"✅ SUCCESS")
            print(f"\n   Fertilizer:  {result.get('fertilizer')}")
            print(f"   Soil Type:   {result.get('soil_type')}")
            print(f"   Crop Type:   {result.get('crop_type')}")
            print(f"   Index:       {result.get('fertilizer_index')}")
        else:
            print(f"❌ FAILED: {result.get('error')}")
    except Exception as e:
        print(f"❌ ERROR: {e}")

print(f"\n{'='*70}")
print(" ✅ All tests completed!")
print("=" * 70)
