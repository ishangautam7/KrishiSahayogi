from flask import Flask, request, jsonify
from flask_cors import CORS
from services import (
    predict_crop, validate_input_data, 
    predict_fertilizer, validate_fertilizer_input_data,
    predict_disease, get_disease_solution
)
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'running',
        'message': 'ML Prediction API is running'
    })


@app.route('/predict_crop', methods=['POST'])
def predict_crop_endpoint():
    try:
        data = request.get_json()
        
        is_valid, error_message = validate_input_data(data)
        if not is_valid:
            return jsonify({
                'success': False,
                'error': error_message
            }), 400
        
        result = predict_crop(
            n=data['n'],
            p=data['p'],
            k=data['k'],
            temp=data['temp'],
            humidity=data['humidity'],
            ph=data['ph'],
            rainfall=data['rainfall']
        )
        
        return jsonify({
            'success': True,
            **result
        })
    
    except FileNotFoundError:
        return jsonify({
            'success': False,
            'error': 'Model file not found. Please train and save the model first.'
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/predict_fertilizer', methods=['POST'])
def predict_fertilizer_endpoint():
    try:
        data = request.get_json()
        
        is_valid, error_message, converted_data = validate_fertilizer_input_data(data)
        if not is_valid:
            return jsonify({
                'success': False,
                'error': error_message
            }), 400
        
        result = predict_fertilizer(
            temp=converted_data['temp'],
            humidity=converted_data['humidity'],
            moisture=converted_data['moisture'],
            soil_type=converted_data['soil_type'],
            crop_type=converted_data['crop_type'],
            nitrogen=converted_data['nitrogen'],
            potassium=converted_data['potassium'],
            phosphorus=converted_data['phosphorus']
        )
        
        return jsonify({
            'success': True,
            **result
        })
    
    except FileNotFoundError:
        return jsonify({
            'success': False,
            'error': 'Model or scaler file not found. Please ensure both files are available.'
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/predict_disease', methods=['POST'])
def predict_disease_endpoint():
    try:
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No image file provided'
            }), 400
        
        image_file = request.files['image']
        
        if image_file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No image file selected'
            }), 400
        
        # Read image bytes
        image_bytes = image_file.read()
        
        # Make prediction
        result = predict_disease(image_bytes)
        
        return jsonify({
            'success': True,
            **result
        })
    
    except FileNotFoundError:
        return jsonify({
            'success': False,
            'error': 'Disease detection model file not found.'
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/get_disease_solution', methods=['POST'])
def get_disease_solution_endpoint():
    try:
        data = request.get_json()
        
        if 'disease_name' not in data:
            return jsonify({
                'success': False,
                'error': 'disease_name is required'
            }), 400
        
        # Extract API key from request body or headers
        api_key = data.get('api_key') or request.headers.get('X-Gemini-API-Key')
        
        result = get_disease_solution(
            disease_name=data['disease_name'],
            api_key=api_key
        )
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)

