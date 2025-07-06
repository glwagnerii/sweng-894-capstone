<script lang="ts">
  import { onMount } from 'svelte'
  import { useSelector, useDispatch } from '../store'
  import { mealsApi, type Meal } from '../store/api'
  import { removeFavorite } from '../store'

  const dispatch = useDispatch()
  const favoriteIds = useSelector((s) => s.app.favorites)

  // Store for fetched meal data
  let meals: Record<string, Meal> = {}
  let loading = true
  let error: string | null = null

  async function fetchMeals() {
    loading = true
    error = null
    meals = {}
    try {
      for (const id of $favoriteIds) {
        const result = await dispatch(mealsApi.endpoints.getMealById.initiate(id)).unwrap()
        meals[id] = result.meals?.[0] || null
      }
    }
    catch { error = 'Failed to load meals' }
    finally { loading = false }
  }

  onMount(() => { fetchMeals() })

  function openRecipe(id: string) { dispatch({ type: 'app/viewDetails', payload: { id } }) }
  function remove(id: string) { dispatch(removeFavorite(id)) }
</script>

<div class="p-4 justify-center max-w-5xl mx-auto space-y-6">
  <h1 class="text-2xl font-bold text-center">My Favorites</h1>

  {#if loading}
    <p class="text-center">Loading...</p>
  {:else if error}
    <p class="text-error text-center">{error}</p>
  {:else if !$favoriteIds.length}
    <p class="text-center opacity-60">No Recipes Have Been Added to Your Favorites.</p>
  {:else}
    <div class="grid justify-center gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {#each $favoriteIds as id (id)}
        {#if meals[id]}
          <div class="card justify-center bg-base-100 shadow-md hover:shadow-lg transition">
            <button type="button" class="w-full h-40 overflow-hidden" onclick={() => openRecipe(id)}>
              <img src={meals[id].strMealThumb} alt={meals[id].strMeal} class="w-full h-full object-cover" />
            </button>
            <div class="card-body p-4">
              <h2 class="card-title text-base">{meals[id].strMeal}</h2>
              <div class="card-actions justify-between mt-2">
                <button class="btn btn-sm btn-secondary" onclick={() => openRecipe(id)}>View</button>
                <button class="btn btn-sm btn-error btn-circle" title="Remove" onclick={() => remove(id)}>✕</button>
              </div>
            </div>
          </div>
        {:else}
          <div class="card bg-base-100 p-4 text-center opacity-60">Meal not found</div>
        {/if}
      {/each}
    </div>
  {/if}
</div>
