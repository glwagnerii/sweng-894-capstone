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

  let ingredient = $derived($name)
  let mealName = $derived(allMealsData.meals.find((item: { idMeal?: string }) => item.idMeal === $recipe)?.strMeal ?? '')

  let recentMeals: Record<string, RecentMeal> = $state({})
  let loading = $state(true)
  let error: string | null = $state(null)

  async function fetchRecents() {
    loading = true
    error = null
    recentMeals = {}
    try {
      for (const recent of $recentsList) {
        const result = await dispatch(mealsApi.endpoints.getMealById.initiate(recent.idMeal)).unwrap()
        const meal = result.meals?.[0]
        if (meal && meal.idMeal === recent.idMeal) {
          recentMeals[recent.idMeal] = {
            idMeal: meal.idMeal,
            strMeal: meal.strMeal,
            strMealThumb: meal.strMealThumb,
            viewedAt: recent.viewedAt,
          }
        }
        // else {
        //   console.warn(`Mismatch or missing meal for ID: ${recent.idMeal}`)
        // }
      }
    }
    catch { error = 'Failed to load recent meals' }
    finally { loading = false }
  }

  onMount(() => { fetchRecents() })

  function searchByName() {
    const found = allMealsData.meals.find((item: { strMeal?: string }) => item.strMeal === mealName)
    dispatch({ type: 'app/viewDetails', payload: { id: found?.idMeal } })
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

<!-- Outer wrapper centers the content; inner is exactly 75% of viewport width on md+ -->
<div class="w-full min-h-[100svh] flex justify-center items-start py-6">
  <div
    id="view-home"
    class="w-[92vw] md:w-[75vw] flex flex-col items-center justify-start px-4 md:px-6
           gap-[clamp(0.75rem,2.2vw,2rem)] font-sans"
  >
    <!-- Logo scales more generously so it doesn't look tiny on large windows -->
    <img
      src="photos/ClassifiCamLogo.png"
      alt="ClassifiCam Logo"
      class="w-[clamp(10rem,30vw,24rem)] h-[clamp(9rem,27vw,22rem)]
             object-cover rounded-xl shadow-md"
    />

    <!-- Search by Name -->
    <div class="w-full flex justify-center">
      <div class="w-full md:w-2/3 max-w-[48rem] mx-auto">
        <SearchBox
          id="mealNameSearch"
          label="Search Recipe by Name"
          options={mealNameOptions}
          bind:value={mealName}
          placeholder="e.g., Arrabiata"
          onSearch={searchByName}
        />
      </div>
    </div>

    <!-- Search by Ingredient -->
    <div class="w-full flex justify-center">
      <div class="w-full md:w-2/3 max-w-[48rem] mx-auto">
        <SearchBox
          id="ingredientSearch"
          label="Search Recipes by Ingredient"
          options={ingredientOptions}
          bind:value={ingredient}
          placeholder="e.g., beef"
          onSearch={searchByIngredient}
        />
      </div>
    </div>

    <!-- Recent Activity Section -->
    <div class="w-full md:w-[clamp(24rem,50vw,44rem)] mt-2">
      <div class="flex items-center justify-between mb-2">
        <h2 class="font-semibold text-[clamp(1rem,0.8rem+0.6vw,1.25rem)]">Recent Activity</h2>
        <button
          class="text-[clamp(0.85rem,0.75rem+0.35vw,1rem)] underline transition"
          onclick={() => dispatch({ type: 'app/viewRecents' })}
        >
          See more
        </button>
      </div>

      {#if loading}
        <p class="text-[clamp(0.9rem,0.8rem+0.3vw,1rem)]">Loading recent activity...</p>
      {:else if error}
        <p class="text-red-500 text-[clamp(0.9rem,0.8rem+0.3vw,1rem)]">{error}</p>
      {:else if $recentsList.length}
        <ul
          class="list bg-base-300 rounded-box shadow-md overflow-y-auto
                 max-h-[clamp(12rem,30vh,24rem)]"
        >
          {#each $recentsList.slice(0, 5) as recent (recent.idMeal)}
            <li class="list-row flex items-center justify-between px-2">
              <button
                type="button"
                class="flex items-center gap-3 cursor-pointer bg-transparent border-0 p-2 focus:outline-none"
                onclick={() => openRecipe(recent.idMeal)}
                aria-label={`View details for ${recentMeals[recent.idMeal]?.strMeal ?? 'meal'}`}
              >
                <!-- Thumbnail -->
                <div class="shrink-0">
                  <img
                    src={recentMeals[recent.idMeal]?.strMealThumb}
                    alt={recentMeals[recent.idMeal]?.strMeal}
                    class="w-[clamp(2.6rem,2.6vw,3.4rem)] h-[clamp(2.6rem,2.6vw,3.4rem)] object-cover rounded"
                  />
                </div>
                <!-- Meal Name & Date -->
                <div class="text-left">
                  <div class="font-medium text-[clamp(0.95rem,0.85rem+0.4vw,1.05rem)] leading-tight">
                    {recentMeals[recent.idMeal]?.strMeal}
                  </div>
                  <div class="text-base-content/70 text-[clamp(0.75rem,0.7rem+0.35vw,0.95rem)] leading-tight">
                    Viewed on {formatViewedAt(recent.viewedAt)}
                  </div>
                </div>
              </button>
              <!-- Delete Button grows on larger windows -->
              <button
                class="btn btn-error btn-circle btn-ghost
                       h-[clamp(1.9rem,1.2rem+1.7vw,2.4rem)]
                       w-[clamp(1.9rem,1.2rem+1.7vw,2.4rem)]
                       text-[clamp(0.9rem,0.8rem+0.35vw,1.1rem)]"
                title="Remove"
                onclick={() => remove(recent.idMeal)}
              >
                ✕
              </button>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-[clamp(0.9rem,0.8rem+0.3vw,1rem)] text-base-content/70">No recent activity.</p>
      {/if}
    </div>
  </div>
</div>
