<script lang="ts">
  import { useSelector, useDispatch } from '../store'
  import { mealsApi } from '../store/api'

  const dispatch = useDispatch()

  const ingredient = useSelector((state) => state.app.ingredient.name)
  const mealsQuery = useSelector((state) => mealsApi.endpoints.getMealsByIngredient.select($ingredient)(state))
  $effect(() => { dispatch(mealsApi.endpoints.getMealsByIngredient.initiate($ingredient)) })

  function handleRecipeClick(idMeal: string) { dispatch({ type: 'app/showRecipe', payload: { id: idMeal } }) }
</script>

<div class="p-4">
  <h1 class="text-center text-2xl font-bold mb-2">Recipe List</h1>
  {#if $mealsQuery?.isLoading}
    <p>Loading meals...</p>
  {:else if $mealsQuery?.error}
    <p class="text-red-500">Failed to load meals.</p>
  {:else if $mealsQuery?.data?.meals?.length}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="recipe-view">
      {#each $mealsQuery.data.meals as recipe (recipe.idMeal)}
        <button
          type="button"
          class="flex bg-base-200 items-center rounded-xl p-3 shadow-md w-full text-left hover:bg-base-300 transition"
          onclick={() => handleRecipeClick(recipe.idMeal)}
        >
          <img src={recipe.strMealThumb} alt={recipe.strMeal} class="w-16 h-16 rounded-lg object-cover mr-4" />
          <div>
            <p class="font-semibold">{recipe.strMeal}</p>
          </div>
        </button>
      {/each}
    </div>
  {:else}
    <p>No meals found.</p>
  {/if}
</div>
