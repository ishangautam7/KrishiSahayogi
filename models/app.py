from flask import Flask, request, jsonify
from flask_cors import CORS
from services import predict_crop, validate_input_data

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'running',
        'message': 'Crop Prediction API is running'
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


if __name__ == '__main__':
    app.run(debug=True, port=5000)
