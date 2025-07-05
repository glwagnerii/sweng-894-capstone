<script lang="ts">
  import { store, useSelector, useDispatch } from '../store'
  import { mealsApi } from '../store/api'
  import { removeFavorite } from '../store/appSlice'

  const dispatch = useDispatch()

  //adding a comment to push again
  // list of ids
  const favoriteIds = useSelector(s => s.app.favorites)

  /* --- trigger API fetches for every id --- */
  $effect(() => {
    $favoriteIds.forEach(id =>
      dispatch(mealsApi.endpoints.getMealById.initiate(id))
    )
  })

  function openRecipe(id: string) {
    dispatch({ type: 'app/showRecipe', payload: { id } })
  }

  function remove(id: string) {
    dispatch(removeFavorite(id))
  }
</script>

<div class="p-4 justify-center max-w-5xl mx-auto space-y-6">
  <h1 class="text-2xl font-bold text-center">My Favorites</h1>

  {#if !$favoriteIds.length}
    <p class="text-center opacity-60">No Recipes Have Been Added to Your Favorites.</p>
  {:else}
    <div class="grid justify-center gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {#each $favoriteIds as id (id)}
        {#await mealsApi.endpoints.getMealById.select(id)(store.getState()).data then mealData}
          {#if mealData?.meals?.[0]}
            {@const meal = mealData.meals[0] }
            <div class="card justify-center bg-base-100 shadow-md hover:shadow-lg transition">
              <button type="button" class="w-full h-40 overflow-hidden"
                      onclick={() => openRecipe(id)}>
                <img src={meal.strMealThumb} alt={meal.strMeal}
                     class="w-full h-full object-cover" />
              </button>

              <div class="card-body p-4">
                <h2 class="card-title text-base">{meal.strMeal}</h2>
                <div class="card-actions justify-between mt-2">
                  <button class="btn btn-sm btn-secondary" onclick={() => openRecipe(id)}>
                    View
                  </button>
                  <button class="btn btn-sm btn-error btn-circle" title="Remove"
                          onclick={() => remove(id)}>✕</button>
                </div>
              </div>
            </div>
          {/if}
        {:catch e}
          <p class="text-error text-sm">{e.message}</p>
        {/await}
      {/each}
    </div>
  {/if}
</div>