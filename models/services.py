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


# Soil type mapping
SOIL_TYPE_MAPPING = {
    0: 'Sandy',
    1: 'Loamy',
    2: 'Black',
    3: 'Red',
    4: 'Clayey'
}

# Crop type mapping for fertilizer
CROP_TYPE_MAPPING = {
    0: 'Maize',
    1: 'Sugarcane',
    2: 'Cotton',
    3: 'Tobacco',
    4: 'Paddy',
    5: 'Barley',
    6: 'Wheat',
    7: 'Millets',
    8: 'Oil seeds',
    9: 'Pulses',
    10: 'Ground Nuts'
}

# Fertilizer mapping
FERTILIZER_MAPPING = {
    0: '10-26-26',
    1: '14-35-14',
    2: '17-17-17',
    3: '20-20',
    4: '28-28',
    5: 'DAP',
    6: 'Urea'
}

# Reverse mappings for string to index conversion (case-insensitive)
SOIL_TYPE_REVERSE = {v.lower(): k for k, v in SOIL_TYPE_MAPPING.items()}
CROP_TYPE_REVERSE = {v.lower(): k for k, v in CROP_TYPE_MAPPING.items()}

_fertilizer_model = None
_fertilizer_scaler = None


def load_fertilizer_model():
    """
    Load the fertilizer recommendation model and scaler from disk
    Uses lazy loading - only loads once on first call
    """
    global _fertilizer_model, _fertilizer_scaler
    
    if _fertilizer_model is None:
        model_path = r"C:\Users\isang\Desktop\TBD\models\models\fertilizer_recomendation_model.pkl"
        scaler_path = r"C:\Users\isang\Desktop\TBD\models\models\fertilizer_recomendation_scaler.pkl"
        
        _fertilizer_model = joblib.load(model_path)
        _fertilizer_scaler = joblib.load(scaler_path)
        print(f"✓ Fertilizer model and scaler loaded successfully")
    
    return _fertilizer_model, _fertilizer_scaler


def predict_fertilizer(temp, humidity, moisture, soil_type, crop_type, nitrogen, potassium, phosphorus):
    """
    Predict fertilizer based on soil and environmental parameters
    
    Args:
        temp: Temperature in degree Celsius
        humidity: Relative humidity in %
        moisture: Soil moisture content
        soil_type: Soil type (0-4)
        crop_type: Crop type (0-10)
        nitrogen: Nitrogen content (4-42)
        potassium: Potassium content (0-19)
        phosphorus: Phosphorus content (0-42)
    
    Returns:
        dict: Contains fertilizer name and index
    """
    model, scaler = load_fertilizer_model()
    
    features = [[temp, humidity, moisture, soil_type, crop_type, nitrogen, potassium, phosphorus]]
    
    features_scaled = scaler.transform(features)
    
    prediction = model.predict(features_scaled)
    fertilizer_index = int(prediction[0])
    fertilizer_name = FERTILIZER_MAPPING.get(fertilizer_index, f'Unknown fertilizer (index: {fertilizer_index})')
    
    return {
        'fertilizer': fertilizer_name
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


def validate_fertilizer_input_data(data):
    """
    Validate input data for fertilizer recommendation
    Accepts both string names and integer indices for soil_type and crop_type
    
    Args:
        data: Dictionary containing input parameters
    
    Returns:
        tuple: (is_valid, error_message, converted_data)
    """
    required_fields = ['temp', 'humidity', 'moisture', 'soil_type', 'crop_type', 'nitrogen', 'potassium', 'phosphorus']
    
    for field in required_fields:
        if field not in data:
            return False, f'Missing required field: {field}', None
    
    # Create a copy to avoid modifying original data
    converted_data = data.copy()
    
    # Convert soil_type (accepts both string and int)
    try:
        soil_type_input = data['soil_type']
        if isinstance(soil_type_input, str):
            soil_type_lower = soil_type_input.lower()
            if soil_type_lower not in SOIL_TYPE_REVERSE:
                valid_types = ', '.join(SOIL_TYPE_MAPPING.values())
                return False, f'Invalid soil_type "{soil_type_input}". Valid values: {valid_types}', None
            converted_data['soil_type'] = SOIL_TYPE_REVERSE[soil_type_lower]
        else:
            soil_type = int(soil_type_input)
            if not (0 <= soil_type <= 4):
                return False, 'soil_type must be between 0 and 4', None
            converted_data['soil_type'] = soil_type
    except (ValueError, KeyError):
        return False, 'Invalid soil_type value', None
    
    # Convert crop_type (accepts both string and int)
    try:
        crop_type_input = data['crop_type']
        if isinstance(crop_type_input, str):
            crop_type_lower = crop_type_input.lower()
            if crop_type_lower not in CROP_TYPE_REVERSE:
                valid_types = ', '.join(CROP_TYPE_MAPPING.values())
                return False, f'Invalid crop_type "{crop_type_input}". Valid values: {valid_types}', None
            converted_data['crop_type'] = CROP_TYPE_REVERSE[crop_type_lower]
        else:
            crop_type = int(crop_type_input)
            if not (0 <= crop_type <= 10):
                return False, 'crop_type must be between 0 and 10', None
            converted_data['crop_type'] = crop_type
    except (ValueError, KeyError):
        return False, 'Invalid crop_type value', None
    
    # Validate numeric ranges
    try:
        nitrogen = int(data['nitrogen'])
        potassium = int(data['potassium'])
        phosphorus = int(data['phosphorus'])
        
        if not (4 <= nitrogen <= 42):
            return False, 'nitrogen must be between 4 and 42', None
        if not (0 <= potassium <= 19):
            return False, 'potassium must be between 0 and 19', None
        if not (0 <= phosphorus <= 42):
            return False, 'phosphorus must be between 0 and 42', None
    except ValueError:
        return False, 'All numeric fields must be valid numbers', None
    
    return True, None, converted_data
