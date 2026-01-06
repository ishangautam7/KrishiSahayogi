import sys
import os
import time

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from services import predict_price
except ImportError as e:
    print(f"Error importing services: {e}")
    sys.exit(1)

def test_prediction():
    print("=" * 60)
    print(" PRICE PREDICTION MODEL VERIFICATION")
    print("=" * 60)
    
    test_cases = [
        {
            "commodity": "Tomato Big(Nepali)",
            "date": "2024-03-15"
        },
        {
            "commodity": "Potato Red",
            "date": "2024-04-10"
        },
        {
            "commodity": "Onion Dry (Indian)", 
            "date": "2024-05-20"
        }
    ]
    
    for i, test in enumerate(test_cases, 1):
        try:
            print(f"\nTest Case {i}: {test['commodity']} on {test['date']}")
            start_time = time.time()
            
            result = predict_price(test['commodity'], test['date'])
            
            elapsed_time = time.time() - start_time
            print(f"✅ Prediction Successful ({elapsed_time:.2f}s)")
            print(f"   Predicted Price: Rs. {result['predicted_price']}")
            
        except Exception as e:
            print(f"❌ Test Failed: {e}")

if __name__ == "__main__":
    test_prediction()
