<script lang="ts">
  import { onMount } from 'svelte'
  import { useSelector, useDispatch } from '../store'
  import { addFavorite, deleteFavorite, toggleInstructionCheck, toggleIngredientCheck } from '../store/appSlice'
  import { mealsApi } from '../store/api'

  const dispatch = useDispatch()

  const recipeId = useSelector((state) => state.app.recipe.id)
  const favoriteIds = useSelector((state) => state.app.favorites)
  const recipeQuery = useSelector((state) => mealsApi.endpoints.getMealById.select($recipeId)(state))
  const checklist = useSelector((state) => state.app.checklist)

  onMount(() => { dispatch(mealsApi.endpoints.getMealById.initiate($recipeId)) })

  const isFavorite = (id: string) => $favoriteIds.includes(id)

  const toggleFavorite = (id: string) => {
    if (isFavorite(id)) { dispatch(deleteFavorite(id)) }
    else { dispatch(addFavorite(id)) }
  }

  const toggleInstruction = (index: number) => { dispatch(toggleInstructionCheck({ recipeId: $recipeId, index })) }
  const toggleIngredient  = (index: number) => { dispatch(toggleIngredientCheck({ recipeId: $recipeId, index })) }

  async function copyToClipboard() {
    const meal = $recipeQuery?.data?.meals?.[0]
    if (!meal) return;

    const ingredients = Array(20).fill(0).map((_, i) => {
      const ingredient = meal['strIngredient' + (i + 1)]
      const measure = meal['strMeasure' + (i + 1)]
      return ingredient && ingredient.trim() ? `${ingredient}${measure ? ` - ${measure}` : ''}` : null
    }).filter(Boolean).join('\n')

    const instructions = meal.strInstructions?.trim() ?? ''

    const text = `
      ${meal.strMeal}
      Category: ${meal.strCategory}
      Area: ${meal.strArea}
      Ingredients: ${ingredients}
      Instructions: ${instructions}
      ${meal.strYoutube ? `Watch on YouTube: ${meal.strYoutube}` : ''}
      `.trim()
        try {
           await navigator.clipboard.writeText(text)
          alert('Recipe copied to clipboard!')
        } catch (err) {
          console.error('Failed to copy', err)
          alert('Failed to copy recipe.')
        }
  }

  $: checkedInstructions = $checklist[$recipeId]?.instructions ?? []
  $: checkedIngredients = $checklist[$recipeId]?.ingredients ?? []
</script>

<div id="view-details" class="p-4">
  <h1 class="text-center text-2xl font-bold mb-2">Recipe Details</h1>
  {#if !$recipeId}
    <p class="text-center text-base-content/70 italic mt-6">
      Please select a recipe to view its details.
    </p>
  {:else if $recipeQuery?.isLoading}
    <p>Loading recipe...</p>
  {:else if $recipeQuery?.error}
    <p class="text-red-500">Failed to load recipe.</p>
  {:else if $recipeQuery?.data?.meals}
    <div class="max-w-xl mx-auto bg-base-100 rounded-xl p-6 space-y-4">
      <h3 class="text-2xl font-bold text-center mb-2">{$recipeQuery.data.meals[0].strMeal}</h3>

      <img
        src="{$recipeQuery.data.meals[0].strMealThumb}"
        alt="{$recipeQuery.data.meals[0].strMeal}"
        class="mx-auto w-80 h-auto rounded-lg shadow border-2 border-base-300"
      />

      <div class="flex flex-col md:flex-row md:justify-between text-base-content">
        <p><strong>Category:</strong> {$recipeQuery.data.meals[0].strCategory}</p>
        <div class="text-center">
          <button
            type="button"
            class="btn btn-sm btn-outline btn-warning"
            onclick={() => toggleFavorite($recipeQuery.data.meals[0].idMeal)}>
            {#if isFavorite($recipeQuery.data.meals[0].idMeal)}
              💔 Remove from Favorites
            {:else}
              ❤ Add to Favorites
            {/if}
          </button>
          <button type="button" class="btn btn-sm btn-outline btn-warning" onclick={() => copyToClipboard()}>
            Copy Recipe
          </button>
        </div>
        <p><strong>Area:</strong> {$recipeQuery.data.meals[0].strArea}</p>
      </div>

      <!-- Instructions with Checkboxes -->
      <div>
        <h4 class="font-semibold mt-4 mb-2">Instructions:</h4>
        <ul class="space-y-2 list-none">
          {#each ($recipeQuery.data.meals[0]?.strInstructions?.split('.').filter((step) => step.trim() !== '') ?? []) as step, i (i)}
            <li class="flex items-start space-x-2">
              <input
                type="checkbox"
                class="checkbox checkbox-accent"
                checked={checkedInstructions.includes(i)}
                onchange={() => toggleInstruction(i)}
              />
              <span class:line-through={checkedInstructions.includes(i)}>{step.trim()}.</span>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Ingredients with Checkboxes -->
      <div>
        <h4 class="font-semibold mt-4 mb-2">Ingredients:</h4>
        <ul class="space-y-1 list-none">
          {#each Array(20).fill(0).map((_, i) => i + 1) as i (i)}
            {#if $recipeQuery.data.meals[0]['strIngredient' + i]?.trim()}
              <li class="flex items-start space-x-2">
                <input
                  type="checkbox"
                  class="checkbox checkbox-success"
                  checked={checkedIngredients.includes(i)}
                  onchange={() => toggleIngredient(i)}
                />
                <span class:line-through={checkedIngredients.includes(i)}>
                  {$recipeQuery.data.meals[0]['strIngredient' + i]}
                  {#if $recipeQuery.data.meals[0]['strMeasure' + i]?.trim()}
                    {`- ${$recipeQuery.data.meals[0]['strMeasure' + i]}`}
                  {/if}
                </span>
              </li>
            {/if}
          {/each}
        </ul>
      </div>

      <!-- YouTube Link -->
      {#if $recipeQuery.data.meals[0].strYoutube}
        <div class="text-center mt-6">
          <a
            href={$recipeQuery.data.meals[0].strYoutube}
            target="_blank"
            rel="noopener"
            class="btn btn-sm btn-primary gap-2">
            ▶ Watch on YouTube
          </a>
        </div>
      {/if}
    </div>
  {:else}
    <p class="text-red-500">No recipe found for the selected ID.</p>
  {/if}
</div>

<style>
  .line-through {
    text-decoration: line-through;
    opacity: 0.6;
  }
</style>
