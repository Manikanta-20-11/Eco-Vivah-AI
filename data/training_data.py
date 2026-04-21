import pandas as pd
import numpy as np
import random
import os

random.seed(42)
np.random.seed(42)

data = []
for _ in range(500):
    num_guests = random.randint(50, 2000)
    duration_days = random.randint(1, 7)
    num_sub_events = random.randint(1, 6)
    is_vegetarian = random.choice([0, 1])
    season = random.randint(1, 4)
    
    base = num_guests * 0.45 * 3 * duration_days
    noise = random.uniform(0.0, 0.25)
    actual = base * (0.75 + noise)
    
    if is_vegetarian == 1:
        actual = actual * 0.88
        
    data.append({
        "num_guests": num_guests,
        "duration_days": duration_days,
        "num_sub_events": num_sub_events,
        "is_vegetarian": is_vegetarian,
        "season": season,
        "actual_food_kg": actual
    })

df = pd.DataFrame(data)

out_path = "data/wedding_training_data.csv"
os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
df.to_csv(out_path, index=False)
print("✅ Training data generated: 500 rows saved to data/wedding_training_data.csv")
