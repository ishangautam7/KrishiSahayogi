"""
Retrain fertilizer recommendation model with current scikit-learn version
This script replicates the training process to ensure compatibility
"""
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os

print("=" * 60)
print("Retraining Fertilizer Recommendation Model")
print("=" * 60)

# Load dataset
dataset_path = r"C:\Users\isang\Desktop\TBD\models\Fertilizer Recomendation\fertilizer_dataset.csv"
df = pd.read_csv(dataset_path)

print(f"\n✓ Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns")
print(f"  Columns: {list(df.columns)}")

# Initialize label encoders
soil_le = LabelEncoder()
crop_le = LabelEncoder()
fertilizer_le = LabelEncoder()

# Encode categorical columns
df['Soil Type'] = soil_le.fit_transform(df['Soil Type'])
df['Crop Type'] = crop_le.fit_transform(df['Crop Type'])
df['Fertilizer Name'] = fertilizer_le.fit_transform(df['Fertilizer Name'])

print("\n✓ Encoded categorical columns")
print(f"  Soil types: {list(soil_le.classes_)}")
print(f"  Crop types: {list(crop_le.classes_)}")
print(f"  Fertilizer types: {list(fertilizer_le.classes_)}")

# Display fertilizer mapping
fertilizer_mapping = dict(zip(fertilizer_le.transform(fertilizer_le.classes_), fertilizer_le.classes_))
print(f"\n  Fertilizer mapping: {fertilizer_mapping}")

# Prepare features and target
X = df.drop('Fertilizer Name', axis=1)
y = df['Fertilizer Name']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.35, random_state=42)

print(f"\n✓ Split data: {X_train.shape[0]} training, {X_test.shape[0]} testing samples")

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("\n✓ Scaled features using StandardScaler")

# Train model
classifier = RandomForestClassifier(random_state=42)
classifier.fit(X_train_scaled, y_train)

print("\n✓ Trained RandomForestClassifier")

# Evaluate
train_score = classifier.score(X_train_scaled, y_train) * 100
test_score = classifier.score(X_test_scaled, y_test) * 100

print(f"\n  Training accuracy: {train_score:.2f}%")
print(f"  Testing accuracy: {test_score:.2f}%")

# Save model and scaler
model_dir = r"C:\Users\isang\Desktop\TBD\models\models"
model_path = os.path.join(model_dir, "fertilizer_recomendation_model.pkl")
scaler_path = os.path.join(model_dir, "fertilizer_recomendation_scaler.pkl")

joblib.dump(classifier, model_path)
joblib.dump(scaler, scaler_path)

print(f"\n✓ Saved model to: {model_path}")
print(f"✓ Saved scaler to: {scaler_path}")

print("\n" + "=" * 60)
print("✅ Model retraining complete!")
print("=" * 60)
print("\nThe new model and scaler are compatible with your current")
print("scikit-learn version. Restart the Flask server to use them.")
