'''docstring'''

import json
import csv
from collections import Counter

# Load all meals
with open('all_meals.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    meals = data.get('meals', [])

ingredient_counter = Counter()

for meal in meals:
    for i in range(1, 21):
        ing = meal.get(f'strIngredient{i}')
        if ing:
            ing = ing.strip()
            if ing:  # skip empty strings
                ingredient_counter[ing] += 1

# Write to CSV
with open('ingredient_counts.csv', 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['ingredient', 'count'])
    for ingredient, count in ingredient_counter.most_common():
        writer.writerow([ingredient, count])

print("Wrote ingredient counts to ingredient_counts.csv")
