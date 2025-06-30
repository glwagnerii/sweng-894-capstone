export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export async function getMealsByIngredients(ingredients: string[]): Promise<Meal[]> {
  const query = ingredients.join(',');
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(query)}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error('Failed to fetch meals');

  const data = await res.json();
  return data.meals || [];
}