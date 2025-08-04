<script lang="ts">
    import { onMount } from 'svelte'
    import { useSelector, useDispatch } from '../store'
    import { mealsApi, type RecentMeal } from '../store/api'
    import { deleteRecentRecipe } from '../store/appSlice'

    const dispatch = useDispatch()
    // const recipe = useSelector((state) => state.app.recipe.id)
    const recentsList = useSelector((state) => state.app.recentsList)
    const openRecipe = (id: string) => { dispatch({ type: 'app/viewDetails', payload: { id } }) }
    const remove = (id: string) => { dispatch(deleteRecentRecipe(id)).then(() => fetchRecents()) }

    let recentMeals: Record<string, RecentMeal> = $state({})
    let loading = $state(true)
    let error: string | null = $state(null)

    async function fetchRecents() {
      loading = true
      error = null
      recentMeals = {}
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
              viewedAt: recent.viewedAt,
            }
          }
          else {
            console.warn(`Mismatch or missing meal for ID: ${recent.idMeal}`)
          }
        }
        console.log('Recent Meals Loaded:', Object.values(recentMeals))
      }
      catch { error = 'Failed to load recent meals' }
      finally { loading = false }
    }

    onMount(() => { fetchRecents() })

    // Derived value for sorted recents (descending by date)
    const sortedRecents = $derived(
      $recentsList.slice().sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()),
    )

    function formatViewedAt(dateStr: string): string {
      const date = new Date(dateStr)
      const day = String(date.getDate()).padStart(2, '0')
      const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase()
      const year = String(date.getFullYear()).slice(-2)
      return `${day}${month}${year}`
    }

</script>

<div id="view-recents" class="p-4 flex flex-col justify-center max-w-5xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-center">All Recent Activity</h1>
    {#if loading}
        <p class="text-center">Loading...</p>
    {:else if error}
        <p class="text-error text-center">{error}</p>
    {:else if !sortedRecents.length}
        <p class="text-center opacity-60">No Recipes Have Been Viewed Recently.</p>
    {:else}
        <div class="grid justify-between gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {#each sortedRecents as meal (meal.idMeal)}
            <div class="card justify-center bg-base-200 shadow-md hover:shadow-lg transition border border-accent">
                <button type="button" class="w-full h-40 overflow-hidden" onclick={() => openRecipe(meal.idMeal)}>
                <img src={meal.strMealThumb} alt={meal.strMeal} class="w-full h-full object-cover" />
                </button>
                <div class="card-body p-4 rounded-b">
                <h2 class="card-title text-base">{meal.strMeal}</h2>
                <p class="text-xs text-base-content/60">Viewed on {formatViewedAt(meal.viewedAt)}</p>
                <div class="card-actions justify-between mt-2">
                    <button class="btn btn-sm btn-secondary" onclick={() => openRecipe(meal.idMeal)}>View</button>
                    <button class="btn btn-sm btn-error btn-circle" title="Remove" onclick={() => remove(meal.idMeal)}>✕</button>
                </div>
                </div>
            </div>
            {/each}
        </div>
    {/if}
</div>
