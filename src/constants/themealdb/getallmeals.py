'''docstring'''

import json

import time
import requests
from tqdm import tqdm

# Load recipe IDs from recipes.json
with open('recipes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    ids = [meal['idMeal'] for meal in data['meals']]

all_meals = []

total = len(ids)
with tqdm(total=total, desc="Fetching meals", ncols=140) as pbar:
    for i, meal_id in enumerate(ids, 1):
        url = f"https://www.themealdb.com/api/json/v1/1/lookup.php?i={meal_id}"
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            meal_data = response.json().get('meals')
            if meal_data:
                str_meal = meal_data[0].get('strMeal', 'Unknown')
                pbar.set_postfix_str(f"[{i}/{total}] idMeal: {meal_id} - {str_meal}")
                all_meals.extend(meal_data)
            else:
                pbar.set_postfix_str(f"[{i}/{total}] idMeal: {meal_id} - No meal data found")
        else:
            pbar.set_postfix_str(f"[{i}/{total}] Failed to fetch meal {meal_id}")
        pbar.update(1)
        time.sleep(0.5)  # Be polite to the API

# Save all results to a single JSON file
with open('all_meals.json', 'w', encoding='utf-8') as f:
    json.dump({"meals": all_meals}, f, indent=2)

print(f"Saved {len(all_meals)} meals to all_meals.json")
