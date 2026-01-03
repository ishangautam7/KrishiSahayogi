"""
Services for crop prediction API
Contains business logic for model loading and predictions
"""
import joblib
import os
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
from io import BytesIO
import google.generativeai as genai
from torch.serialization import add_safe_globals


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
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, "models", "crop_prediction_model.pkl")
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
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, "models", "fertilizer_recomendation_model.pkl")
        scaler_path = os.path.join(base_dir, "models", "fertilizer_recomendation_scaler.pkl")
        
        _fertilizer_model = joblib.load(model_path)
        _fertilizer_scaler = joblib.load(scaler_path)
        print(f"✓ Fertilizer model and scaler loaded successfully from {model_path}")
    
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



class ResNet9(nn.Module):
    """ResNet9 model for plant disease classification"""
    def __init__(self, in_channels, num_classes):
        super(ResNet9, self).__init__()

        def conv_block(in_channels, out_channels, pool=False):
            layers = [
                nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
                nn.BatchNorm2d(out_channels),
                nn.ReLU(inplace=True)
            ]
            if pool:
                layers.append(nn.MaxPool2d(2))
            return nn.Sequential(*layers)

        self.conv1 = conv_block(in_channels, 64)
        self.conv2 = conv_block(64, 128, pool=True)

        self.res1 = nn.Sequential(
            conv_block(128, 128),
            conv_block(128, 128)
        )

        self.conv3 = conv_block(128, 256, pool=True)
        self.conv4 = conv_block(256, 512, pool=True)

        self.res2 = nn.Sequential(
            conv_block(512, 512),
            conv_block(512, 512)
        )

        self.classifier = nn.Sequential(
            nn.MaxPool2d(4),
            nn.Flatten(),
            nn.Linear(512 * 4 * 4, num_classes)
        )

    def forward(self, x):
        x = self.conv1(x)
        x = self.conv2(x)
        x = self.res1(x) + x
        x = self.conv3(x)
        x = self.conv4(x)
        x = self.res2(x) + x
        return self.classifier(x)


add_safe_globals([ResNet9])

# Also register in __main__ module to handle pickled references
import sys
sys.modules['__main__'].ResNet9 = ResNet9


DISEASE_CLASS_NAMES = {
    0: 'Apple___Apple_scab',
    1: 'Apple___Black_rot',
    2: 'Apple___Cedar_apple_rust',
    3: 'Apple___healthy',
    4: 'Blueberry___healthy',
    5: 'Cherry_(including_sour)___Powdery_mildew',
    6: 'Cherry_(including_sour)___healthy',
    7: 'Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot',
    8: 'Corn_(maize)___Common_rust_',
    9: 'Corn_(maize)___Northern_Leaf_Blight',
    10: 'Corn_(maize)___healthy',
    11: 'Grape___Black_rot',
    12: 'Grape___Esca_(Black_Measles)',
    13: 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    14: 'Grape___healthy',
    15: 'Orange___Haunglongbing_(Citrus_greening)',
    16: 'Peach___Bacterial_spot',
    17: 'Peach___healthy',
    18: 'Pepper,_bell___Bacterial_spot',
    19: 'Pepper,_bell___healthy',
    20: 'Potato___Early_blight',
    21: 'Potato___Late_blight',
    22: 'Potato___healthy',
    23: 'Raspberry___healthy',
    24: 'Soybean___healthy',
    25: 'Squash___Powdery_mildew',
    26: 'Strawberry___Leaf_scorch',
    27: 'Strawberry___healthy',
    28: 'Tomato___Bacterial_spot',
    29: 'Tomato___Early_blight',
    30: 'Tomato___Late_blight',
    31: 'Tomato___Leaf_Mold',
    32: 'Tomato___Septoria_leaf_spot',
    33: 'Tomato___Spider_mites_Two-spotted_spider_mite',
    34: 'Tomato___Target_Spot',
    35: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    36: 'Tomato___Tomato_mosaic_virus',
    37: 'Tomato___healthy'
}


_disease_model = None
_disease_transform = None


def load_disease_model():
    """Load the plant disease detection model"""
    global _disease_model, _disease_transform
    
    if _disease_model is None:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, "models", "plant-disease-model-complete.pth")
        
        _disease_model = torch.load(
            model_path,
            map_location="cpu",
            weights_only=False
        )
        _disease_model.eval()
        
        _disease_transform = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor()
        ])
        
        print(f"✓ Disease detection model loaded successfully from {model_path}")
    
    return _disease_model, _disease_transform


def predict_disease(image_bytes):
    """
    Predict plant disease from image bytes
    
    Args:
        image_bytes: Image file bytes
    
    Returns:
        dict: Contains disease name and formatted display name
    """
    model, transform = load_disease_model()
    
    # Open and preprocess image
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    img_tensor = transform(image).unsqueeze(0)
    
    # Make prediction
    with torch.no_grad():
        output = model(img_tensor)
        _, predicted = torch.max(output, 1)
    
    disease_index = predicted.item()
    disease_name = DISEASE_CLASS_NAMES.get(disease_index, f'Unknown disease (index: {disease_index})')
    
    display_name = disease_name.replace('___', ' - ').replace('_', ' ')
    
    return {
        'disease': disease_name,
        'display_name': display_name,
        'disease_index': disease_index
    }


def get_disease_solution(disease_name, api_key=None):
    """
    Get treatment solution for a plant disease using Google Gemini
    
    Args:
        disease_name: Name of the disease
        api_key: Google Gemini API key
    
    Returns:
        dict: Contains solution text and metadata
    """
    # Check if plant is healthy - no solution needed
    if 'healthy' in disease_name.lower():
        return {
            'success': True,
            'solution': '',
            'disease': disease_name.replace('___', ' - ').replace('_', ' ')
        }
    
    if not api_key:
        api_key = os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        return {
            'success': False,
            'error': 'Google Gemini API key not provided. Please set GEMINI_API_KEY environment variable.'
        }
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash-lite')
        
        formatted_disease = disease_name.replace('___', ' - ').replace('_', ' ')
        
        prompt = f"""You are an agricultural expert. A farmer's plant has: {formatted_disease}

Provide ONLY actionable steps in this exact format:

What to do now:
• [Step 1]
• [Step 2]
• [Step 3]

Prevention:
• [Prevention tip 1]
• [Prevention tip 2]

Keep it brief, practical, and farmer-friendly. Use bullet points only."""
        
        response = model.generate_content(prompt)
        
        return {
            'success': True,
            'solution': response.text,
            'disease': formatted_disease
        }
    
    except Exception as e:
        return {
            'success': False,
            'error': f'Error generating solution: {str(e)}'
        }

