# Flask Crop Recommendation API

## Setup Instructions

### 1. **Activate Virtual Environment**
```bash
# On Windows
.\venv\Scripts\activate

# You should see (venv) in your terminal
```

### 2. **Install Dependencies**
```bash
pip install flask flask-cors joblib scikit-learn numpy pandas
```

### 3. **Run the Flask API**

**Method 1: Using Python directly (Recommended)**
```bash
python app.py
```

**Method 2: Using Flask CLI**
```bash
flask run
```

The API will start on `http://127.0.0.1:5000/`

## API Endpoints

### Health Check
- **URL**: `GET /`
- **Response**:
```json
{
  "status": "running",
  "message": "Crop Recommendation API is running"
}
```

### Predict Crop
- **URL**: `POST /predict_crop`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "n": 90,
  "p": 42,
  "k": 43,
  "temp": 20.5,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 202.9
}
```
- **Success Response**:
```json
{
  "success": true,
  "crop": "rice"
}
```
- **Error Response** (if model not found):
```json
{
  "success": false,
  "error": "Model file not found. Please train and save the model first."
}
```

## Testing the API

### Using cURL:
```bash
curl -X POST http://127.0.0.1:5000/predict_crop \
  -H "Content-Type: application/json" \
  -d "{\"n\":90,\"p\":42,\"k\":43,\"temp\":20.5,\"humidity\":82,\"ph\":6.5,\"rainfall\":202.9}"
```

### Using PowerShell:
```powershell
$body = @{
    n = 90
    p = 42
    k = 43
    temp = 20.5
    humidity = 82
    ph = 6.5
    rainfall = 202.9
} | ConvertTo-Json

Invoke-RestMethod -Uri http://127.0.0.1:5000/predict_crop -Method Post -Body $body -ContentType "application/json"
```

### Using Postman or Insomnia:
1. Set method to `POST`
2. URL: `http://127.0.0.1:5000/predict_crop`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON): Copy the example JSON above

## Important Notes

⚠️ **Model File Required**: You need to have a trained model saved as `crop_recommendation_model.joblib` in the same directory as `app.py`.

If you don't have the model yet, you need to:
1. Train your crop recommendation model
2. Save it using: `joblib.dump(model, 'crop_recommendation_model.joblib')`

## Parameters Explanation

- **n**: Nitrogen content ratio in soil
- **p**: Phosphorus content ratio in soil
- **k**: Potassium content ratio in soil
- **temp**: Temperature in degree Celsius
- **humidity**: Relative humidity in %
- **ph**: pH value of the soil
- **rainfall**: Rainfall in mm
