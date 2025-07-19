<script lang="ts">
  import { onMount } from 'svelte'
  import { useSelector, useDispatch } from '../store'
  import { mealsApi, type Meal } from '../store/api'
  import { removeFavorite } from '../store'

  const dispatch = useDispatch()
  const favoriteIds = useSelector((s) => s.app.favorites)

  let meals: Record<string, Meal> = {}
  let categories: Set<string> = new Set()
  let selectedCategory: string = ''
  let loading = true
  let error: string | null = null

  async function fetchMeals() {
    loading = true
    error = null
    meals = {}
    categories = new Set()
    try {
      for (const id of $favoriteIds) {
        const result = await dispatch(mealsApi.endpoints.getMealById.initiate(id)).unwrap()
        const meal = result.meals?.[0]
        if (meal) {
          meals[id] = meal
          if (meal.strCategory) categories.add(meal.strCategory)
        }
      }
    } catch {
      error = 'Failed to load meals'
    } finally {
      loading = false
    }
  }

  function openRecipe(id: string) {
    dispatch({ type: 'app/viewDetails', payload: { id } })
  }

  function remove(id: string) {
    dispatch(removeFavorite(id))
  }

  onMount(() => {
    fetchMeals()
  })
</script>

<div class="flex flex-col items-center justify-center gap-4 mb-6">
  <h1 class="text-2xl font-bold text-center">My Favorites</h1>

  <details class="dropdown">
    <summary class="btn m-1 bg-secondary">
      {selectedCategory || 'Filter by Category'}
    </summary>
    <ul class="menu dropdown-content bg-secondary rounded-box z-1 w-52 p-2 shadow-sm">
      <li>
        <a on:click={() => selectedCategory = ''}>All</a>
       </li>
      {#each Array.from(categories) as cat}
        <li>
           <a on:click={() => selectedCategory = cat}>{cat}</a>
        </li>
      {/each}
    </ul>
  </details>

  {#if loading}
    <p class="text-center">Loading...</p>
  {:else if error}
    <p class="text-error text-center">{error}</p>
  {:else if !$favoriteIds.length}
    <p class="text-center opacity-60">No Recipes Have Been Added to Your Favorites.</p>
  {:else}
    <div class="grid justify-between gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {#each $favoriteIds as id (id)}
        {#if meals[id] && (!selectedCategory || meals[id].strCategory === selectedCategory)}
          <div class="card justify-center bg-base-100 shadow-md hover:shadow-lg transition">
            <button type="button" class="w-full h-40 overflow-hidden" on:click={() => openRecipe(id)}>
              <img src={meals[id].strMealThumb} alt={meals[id].strMeal} class="w-full h-full object-cover" />
            </button>
            <div class="card-body p-4">
              <h2 class="card-title text-base">{meals[id].strMeal}</h2>
              <div class="card-actions justify-between mt-2">
                <button class="btn btn-sm btn-secondary" on:click={() => openRecipe(id)}>View</button>
                <button class="btn btn-sm btn-error btn-circle" title="Remove" on:click={() => remove(id)}>✕</button>
              </div>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>