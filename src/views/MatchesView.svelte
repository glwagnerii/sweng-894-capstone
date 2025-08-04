<script lang="ts">
  import { onMount } from 'svelte'
  import { useSelector, useDispatch } from '../store'
  import { addRecentRecipe } from '../store/appSlice'
  import { mealsApi } from '../store/api'

  const dispatch = useDispatch()

  const ingredient = useSelector((state) => state.app.ingredient.name)
  const mealsQuery = useSelector((state) => mealsApi.endpoints.getMealsByIngredient.select($ingredient)(state))
  onMount(() => { dispatch(mealsApi.endpoints.getMealsByIngredient.initiate($ingredient)) })

  function handleRecipeClick(idMeal: string, name: string, thumbnail: string) {
    console.log(`Adding to Recents from MatchesView: ${name} (${idMeal})`)
    dispatch(addRecentRecipe({
      idMeal: idMeal,
      strMeal: name,
      strMealThumb: thumbnail,
      viewedAt: new Date().toISOString(),
    }))
    dispatch({ type: 'app/viewDetails', payload: { id: idMeal } })
  }
</script>

<div id="view-matches" class="p-4">
  <h1 class="text-center text-2xl font-bold mb-2">Recipe List</h1>
  {#if !$ingredient}
  <p class="text-center text-base-content/70 italic mt-6">
    Please choose an ingredient or recipe to view matches.
  </p>
  {:else if $mealsQuery?.isLoading}
    <p>Loading meals...</p>
  {:else if $mealsQuery?.error}
    <p class="text-red-500">Failed to load meals.</p>
    {:else if $mealsQuery?.data?.meals?.length}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="recipe-view">
        {#each $mealsQuery.data.meals as recipe (recipe.idMeal)}
          <button
            type="button"
            class="flex bg-base-200 items-center rounded-xl p-3 shadow-md w-full text-left hover:bg-base-300 transition"
            onclick={() => handleRecipeClick(recipe.idMeal ?? '', recipe.strMeal ?? '', recipe.strMealThumb ?? '')}
          >
            <img src={recipe.strMealThumb} alt={recipe.strMeal} class="w-16 h-16 rounded-lg object-cover mr-4" />
            <div>
              <p class="font-semibold">{recipe.strMeal}</p>
            </div>
          </button>
        {/each}
      </div>
  {:else}
  <p class="text-red-500">No meals found for “{$ingredient}”.</p>
  {/if}
</div>
