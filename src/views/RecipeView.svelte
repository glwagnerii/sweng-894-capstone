<script lang="ts">
  import { onMount } from 'svelte'
  import { useSelector, useDispatch } from '../store'
  const dispatch = useDispatch()

  const ingredient = useSelector((state) => state.app.ingredient.name)
  const url = $derived(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${$ingredient}`)

  type Meal = {
    strMeal: string
    strMealThumb: string
    idMeal: string
  }

  let recipes = $state<Meal[]>([])
  let loading = $state(true)
  let error = $state<string | null>(null)

  async function fetchRecipes() {
    loading = true
    error = null
    try {
      const res = await fetch(url)
      const data = await res.json()
      recipes = data.meals as Meal[]
    }
    catch { console.log('Failed to load recipes.') }
    finally { loading = false }
  }

  function handleRecipeClick(idMeal: string) {
    dispatch({ type: 'app/showRecipe', payload: { id: idMeal } })
  }

  onMount(() => { fetchRecipes() })
</script>

<div class="p-4">
  {#if loading}
    <p>Loading recipes...</p>
  {:else if error}
    <p class="text-red-500">{error}</p>
  {:else}
    <!-- Recipe list in two columns -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="recipe-view">
      {#each recipes as recipe (recipe.idMeal)}
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
  {/if}
</div>
