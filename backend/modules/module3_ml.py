import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import StandardScaler
import pickle
import os
from datetime import datetime

from backend.modules.module1_inputs import WeddingInput

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "data", "food_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "data", "food_scaler.pkl")
TRAINING_DATA_PATH = os.path.join(BASE_DIR, "data", "wedding_training_data.csv")

def train_model() -> None:
    """Trains the RandomForestRegressor model on synthetic food dataset."""
    df = pd.read_csv(TRAINING_DATA_PATH)
    
    X = df[['num_guests', 'duration_days', 'num_sub_events', 'is_vegetarian', 'season']]
    y = df['actual_food_kg']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    y_pred = model.predict(X_test_scaled)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print("📊 Model Training Results:")
    print(f"   MAE  : {mae:.2f} kg")
    print(f"   R²   : {r2:.4f}")
    
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
        
    with open(SCALER_PATH, 'wb') as f:
        pickle.dump(scaler, f)
        
    print("✅ Model saved to data/food_model.pkl")

def load_model() -> tuple:
    """Loads and returns the pre-trained ML model and data scaler."""
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        raise FileNotFoundError("Model not found. Please run train_model() first.")
        
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
        
    with open(SCALER_PATH, 'rb') as f:
        scaler = pickle.load(f)
        
    return model, scaler

def prepare_features(wedding_input: WeddingInput) -> np.ndarray:
    """Extracts required input features directly from WeddingInput metadata."""
    num_guests = wedding_input.num_guests
    duration_days = wedding_input.duration_days
    num_sub_events = len(wedding_input.sub_events)
    
    # 1 if vegetarian exists in preferences
    is_vegetarian = 1 if any("vegetarian" in p.lower() for p in wedding_input.cultural_preferences) else 0
    
    month = datetime.now().month
    if month in (11, 12, 1, 2):
        season = 1
    elif month in (3, 4, 5):
        season = 2
    elif month in (6, 7, 8):
        season = 3
    else:
        season = 4
        
    return np.array([[num_guests, duration_days, num_sub_events, is_vegetarian, season]])

def predict_food_quantity(wedding_input: WeddingInput) -> dict:
    """Infers optimal food demand using loaded robust estimators and computes comparative baseline metrics."""
    model, scaler = load_model()
    
    features = prepare_features(wedding_input)
    import pandas as pd
    feature_df = pd.DataFrame(features, columns=["num_guests", "duration_days", "num_sub_events", "is_vegetarian", "season"])
    scaled_features = scaler.transform(feature_df)
    predicted_raw = model.predict(scaled_features)[0]
    
    baseline_raw = wedding_input.num_guests * 0.45 * 3 * wedding_input.duration_days
    
    predicted_food_kg = round(float(predicted_raw), 2)
    baseline_food_kg = round(float(baseline_raw), 2)
    
    savings_kg = round(baseline_food_kg - predicted_food_kg, 2)
    
    if baseline_food_kg > 0:
        savings_percent = round((savings_kg / baseline_food_kg) * 100, 1)
    else:
        savings_percent = 0.0
        
    if savings_kg > 0:
        recommendation = f"Reduce food preparation by {savings_kg:.2f} kg ({savings_percent}%) compared to standard estimate."
    else:
        recommendation = "Predicted quantity aligns with standard estimate."
        
    return {
        "predicted_food_kg": predicted_food_kg,
        "baseline_food_kg": baseline_food_kg,
        "savings_kg": savings_kg,
        "savings_percent": savings_percent,
        "recommendation": recommendation
    }

def print_ml_report(prediction: dict) -> None:
    """Cleanly prints the model's analytical outcomes and suggestions."""
    print("============================================")
    print(" ECO-VIVAH AI — ML Food Prediction")
    print("============================================")
    print(f"  Baseline estimate : {prediction['baseline_food_kg']:.2f} kg")
    print(f"  ML prediction     : {prediction['predicted_food_kg']:.2f} kg")
    print(f"  Potential savings : {prediction['savings_kg']:.2f} kg ({prediction['savings_percent']}%)")
    print("")
    print(f"  💡 {prediction['recommendation']}")
    print("============================================")
