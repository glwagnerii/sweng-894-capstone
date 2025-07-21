<script lang="ts">
  import { onMount } from 'svelte'
  import { useSelector, useDispatch } from '../store'
  import { mealsApi, type Meal } from '../store/api'
  import { deleteFavorite } from '../store/appSlice'

  const dispatch = useDispatch()
  const favoriteIds = useSelector((s) => s.app.favorites)

  // Store for fetched meal data
  let meals: Record<string, Meal> = $state({})
  let categories: Set<string> = $state(new Set())
  let selectedCategory: string = $state('')
  let loading = $state(true)
  let error: string | null = $state(null)
  let openDropdown = $state(false)

  async function fetchMeals() {
    loading = true
    error = null
    meals = {}
    try {
      for (const id of $favoriteIds) {
        const result = await dispatch(mealsApi.endpoints.getMealById.initiate(id)).unwrap()
        const meal = result.meals?.[0]
        if (meal) {
          meals[id] = meal
          if (meal.strCategory) categories.add(meal.strCategory)
        }
      }
      categories = new Set(categories)
    }
    catch { error = 'Failed to load meals' }
    finally { loading = false }
  }

  onMount(() => { fetchMeals() })

  const select = (cat: string) => { selectedCategory = cat; openDropdown = false }
  const openRecipe = (id: string) => { dispatch({ type: 'app/viewDetails', payload: { id } }) }
  const remove = (id: string) => { dispatch(deleteFavorite(id)) }
</script>

<div class="p-4 flex flex-col justify-center max-w-5xl mx-auto space-y-6">
  <h1 class="text-2xl font-bold text-center">My Favorites</h1>

  <details class="dropdown" bind:open={openDropdown}>
    <summary class="btn m-1 bg-secondary">{selectedCategory || 'Filter by Category'}</summary>
    <ul class="menu dropdown-content bg-secondary rounded-box z-1 w-52 p-2 shadow-sm">
      <li>
        <button type="button" class="w-full text-left" onclick={() => select('')}>All</button>
       </li>
      {#each Array.from(categories) as cat (cat)}
        <li>
           <button type="button" class="w-full text-left" onclick={() => select(cat)}>{cat}</button>
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
          <div class="card justify-center bg-base-100 shadow-md hover:shadow-lg transition border border-accent">
            <button type="button" class="w-full h-40 overflow-hidden" onclick={() => openRecipe(id)}>
              <img src={meals[id].strMealThumb} alt={meals[id].strMeal} class="w-full h-full object-cover" />
            </button>
            <div class="card-body p-4 bg-black/20 rounded-b">
              <h2 class="card-title text-base">{meals[id].strMeal}</h2>
              <div class="card-actions justify-between mt-2">
                <button class="btn btn-sm btn-secondary" onclick={() => openRecipe(id)}>View</button>
                <button class="btn btn-sm btn-error btn-circle" title="Remove" onclick={() => remove(id)}>✕</button>
              </div>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>
