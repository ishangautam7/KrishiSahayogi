"""
Services for crop prediction API
Contains business logic for model loading and predictions
"""
import joblib
import os

# Crop name mapping
CROP_MAPPING = {
    0: 'apple',
    1: 'banana',
    2: 'blackgram',
    3: 'chickpea',
    4: 'coconut',
    5: 'coffee',
    6: 'cotton',
    7: 'grapes',
    8: 'jute',
    9: 'kidneybeans',
    10: 'lentil',
    11: 'maize',
    12: 'mango',
    13: 'mothbeans',
    14: 'mungbean',
    15: 'muskmelon',
    16: 'orange',
    17: 'papaya',
    18: 'pigeonpeas',
    19: 'pomegranate',
    20: 'rice',
    21: 'watermelon'
}

# Global model variable
_crop_recommendation_model = None


def load_crop_prediction_model():
    """
    Load the crop prediction model from disk
    Uses lazy loading - only loads once on first call
    """
    global _crop_recommendation_model
    if _crop_recommendation_model is None:
        model_path = r"C:\Users\isang\Desktop\TBD\models\models\crop_prediction_model.pkl"
        _crop_recommendation_model = joblib.load(model_path)
        print(f"✓ Model loaded successfully from {model_path}")
    return _crop_recommendation_model


def predict_crop(n, p, k, temp, humidity, ph, rainfall):
    """
    Predict crop based on soil and weather parameters
    
    Args:
        n: Nitrogen content ratio in soil
        p: Phosphorus content ratio in soil
        k: Potassium content ratio in soil
        temp: Temperature in degree Celsius
        humidity: Relative humidity in %
        ph: pH value of the soil
        rainfall: Rainfall in mm
    
    Returns:
        dict: Contains crop name and index
    """
    model = load_crop_prediction_model()
    
    # Prepare features
    features = [[n, p, k, temp, humidity, ph, rainfall]]
    
    # Make prediction
    prediction = model.predict(features)
    crop_index = int(prediction[0])
    crop_name = CROP_MAPPING.get(crop_index, f'Unknown crop (index: {crop_index})')
    
    return {
        'crop': crop_name,
        'crop_index': crop_index
    }


def validate_input_data(data):
    """
    Validate input data for crop prediction
    
    Args:
        data: Dictionary containing input parameters
    
    Returns:
        tuple: (is_valid, error_message)
    """
    required_fields = ['n', 'p', 'k', 'temp', 'humidity', 'ph', 'rainfall']
    
    for field in required_fields:
        if field not in data:
            return False, f'Missing required field: {field}'
    
    return True, None
