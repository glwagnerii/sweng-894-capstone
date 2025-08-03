<script lang="ts">
  import { onMount } from 'svelte'
  import { useSelector, useDispatch } from '../store'
  import { deleteRecentRecipe } from '../store/appSlice'
  import SearchBox from '../components/SearchBox.svelte'
  import ingredientsData from '../constants/themealdb/ingredients.json'
  import allMealsData from '../constants/themealdb/all_meals.json'
  import { mealsApi, type RecentMeal } from '../store/api'

  const dispatch = useDispatch()
  const name = useSelector((state) => state.app.ingredient.name)
  const recipe = useSelector((state) => state.app.recipe.id)
  const recentsList = useSelector((state) => state.app.recentsList)

  let ingredient = $derived($name);
  let mealName = $derived(allMealsData.meals.find((item: { idMeal?: string }) => item.idMeal === $recipe)?.strMeal ?? '')

  let recentMeals: Record<string, RecentMeal> = $state({})
  let loading = $state(true)
  let error: string | null = $state(null)

  async function fetchRecents() {
    loading = true;
    error = null;
    recentMeals = {};
    try {
      console.log('Fetching Recents List:', $recentsList)
      for (const recent of $recentsList) {
        const result = await dispatch(mealsApi.endpoints.getMealById.initiate(recent.idMeal)).unwrap()
        const meal = result.meals?.[0]
        if (meal && meal.idMeal === recent.idMeal) {
          recentMeals[recent.idMeal] = {
            idMeal: meal.idMeal,
            strMeal: meal.strMeal,
            strMealThumb: meal.strMealThumb,
            viewedAt: recent.viewedAt
          };
        } else {
          console.warn(`Mismatch or missing meal for ID: ${recent.idMeal}`)
        }
      }
      console.log('Recent Meals Loaded:', Object.values(recentMeals))
    }
    catch { error = 'Failed to load recent meals' }
    finally { loading = false }
  }

  onMount(() => { fetchRecents() })

  function searchByName() {
    const found = allMealsData.meals.find((item: { strMeal?: string }) => item.strMeal === mealName);
    dispatch({ type: 'app/viewDetails', payload: { id: found?.idMeal } });
  }

  function searchByIngredient() {
    dispatch({ type: 'app/viewMatches', payload: { name: ingredient } })
  }

  const ingredientOptions = ingredientsData.meals
    .map((item: { strIngredient?: string }) => item.strIngredient)
    .filter((name): name is string => !!name && name.trim().length > 0)
    .sort((a, b) => a.localeCompare(b))

  const mealNameOptions = allMealsData.meals
    .map((item: { strMeal?: string }) => item.strMeal)
    .filter((name): name is string => !!name && name.trim().length > 0)
    .sort((a, b) => a.localeCompare(b))

  function formatViewedAt(dateStr: string): string {
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2, '0')
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    const year = String(date.getFullYear()).slice(-2)
    return `${day}${month}${year}`
  }

  const openRecipe = (id: string) => { dispatch({ type: 'app/viewDetails', payload: { id } }) }
  const remove = (id: string) => { dispatch(deleteRecentRecipe(id)).then(() => fetchRecents()) }
</script>

<div id="view-home" class="flex flex-col items-center justify-start p-4 space-y-6 font-sans">
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

    {#if loading}
      <p>Loading recent activity...</p>
    {:else if error}
      <p class="text-red-500">{error}</p>
    {:else if $recentsList.length}
      <ul class="list bg-base-100 rounded-box shadow-md overflow-y-auto max-h-80">
        {#each $recentsList.slice(0, 5) as recent (recent.idMeal)}
          <li class="list-row flex items-center justify-between">

            <div class="flex items-center space-x-2 cursor-pointer" onclick={() => openRecipe(recent.idMeal)}>
              <!-- Thumbnail -->
              <div>
                <img src={recentMeals[recent.idMeal]?.strMealThumb} alt={recentMeals[recent.idMeal]?.strMeal} class="w-10 h-10 object-cover rounded" />
              </div>
              <!-- Meal Name & Date -->
              <div>
                <div class="text-sm font-medium">{recentMeals[recent.idMeal]?.strMeal}</div>
                <div class="text-xs text-base-content/70">Viewed on {formatViewedAt(recent.viewedAt)}</div>
              </div>
            </div>
            <!-- Delete Button -->
            <button class="btn btn-sm btn-error btn-circle btn-ghost" title="Remove" onclick={() => remove(recent.idMeal)}>✕</button>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-sm text-gray-500">No recent activity.</p>
    {/if}
  </div>
</div>
