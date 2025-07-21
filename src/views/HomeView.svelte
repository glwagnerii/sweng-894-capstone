<script lang="ts">
  import { useSelector, useDispatch } from '../store'
  import SearchBox from '../components/SearchBox.svelte'
  import ingredientsData from '../constants/themealdb/ingredients.json'
  import allMealsData from '../constants/themealdb/all_meals.json'

  const dispatch = useDispatch()
  const name   = useSelector((state) => state.app.ingredient.name)
  const recipe = useSelector((state) => state.app.recipe.id)

  let ingredient = $derived($name)
  let mealName = $derived(allMealsData.meals.find((item: { idMeal?: string }) => item.idMeal === $recipe)?.strMeal ?? '')

  function searchByName() {
    const found = allMealsData.meals.find((item: { strMeal?: string }) => item.strMeal === mealName)
    dispatch({ type: 'app/viewDetails', payload: { id: found?.idMeal } })
  }

  function searchByIngredient() { dispatch({ type: 'app/viewMatches', payload: { name: ingredient } }) }

  function getIngredientOptions(): string[] {
    return ingredientsData.meals
      .map((item: { strIngredient?: string }) => item.strIngredient)
      .filter((name): name is string => !!name && name.trim().length > 0)
      .sort((a, b) => a.localeCompare(b))
  }

  function getMealNameOptions(): string[] {
    return allMealsData.meals
      .map((item: { strMeal?: string }) => item.strMeal)
      .filter((name): name is string => !!name && name.trim().length > 0)
      .sort((a, b) => a.localeCompare(b))
  }

  const ingredientOptions = getIngredientOptions()
  const mealNameOptions = getMealNameOptions()

</script>

<div class="flex flex-col items-center justify-start p-4 space-y-6 font-sans">
  <img src="photos/ClassifiCamLogo.png" alt="ClassifiCam Logo" class="w-64 h-60 object-cover rounded-xl shadow-md" />

  <SearchBox
    id="mealNameSearch"
    label="Search Recipe by Name"
    options={mealNameOptions}
    bind:value={mealName}
    placeholder="e.g., Arrabiata"
    onSearch={searchByName}
  />

  <SearchBox
    id="ingredientSearch"
    label="Search Recipes by Ingredient"
    options={ingredientOptions}
    bind:value={ingredient}
    placeholder="e.g., beef"
    onSearch={searchByIngredient}
  />

  <!-- Recent Activity Section -->
  <div class="w-full max-w-xs mt-6">
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-md font-semibold">Recent Activity</h2>
      <button
        class="text-sm underline transition"
        onclick={() => console.log('See more clicked')}
      >
        See more
      </button>
    </div>
  </div>
</div>
