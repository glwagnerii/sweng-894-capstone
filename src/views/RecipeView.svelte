<script lang="ts">
  import { onMount } from 'svelte'
  import { useSelector } from '../store'

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
        <div class="flex bg-base-200 items-center rounded-xl p-3 shadow-md">
          <img src={recipe.strMealThumb} alt={recipe.strMeal} class="w-16 h-16 rounded-lg object-cover mr-4" />
          <div>
            <p class="font-semibold">{recipe.strMeal}</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
