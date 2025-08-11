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
    if (!meal) return

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
Ingredients:
${ingredients}

Instructions:
${instructions}
${meal.strYoutube ? `Watch on YouTube: ${meal.strYoutube}` : ''}`.trim()

    try {
      await navigator.clipboard.writeText(text)
      alert('Recipe copied to clipboard!')
    }
    catch (err) {
      console.error('Failed to copy', err)
      alert('Failed to copy recipe.')
    }
  }

  $: checkedInstructions = $checklist[$recipeId]?.instructions ?? []
  $: checkedIngredients = $checklist[$recipeId]?.ingredients ?? []
</script>

<!-- 75% lane on desktop, centered; fluid spacing -->
<div class="w-full min-h-[100svh] flex justify-center items-start py-6">
  <div
    id="view-details"
    class="w-[92vw] md:w-[75vw] flex flex-col items-center
           gap-[clamp(0.75rem,2vw,1.5rem)] font-sans"
  >
    <h1 class="text-center font-bold text-[clamp(1.25rem,1rem+1.2vw,2rem)]">
      Recipe Details
    </h1>

    {#if !$recipeId}
      <p class="text-center text-base-content/70 italic mt-6 max-w-prose px-4
                text-[clamp(0.95rem,0.9rem+0.3vw,1.1rem)]">
        Please select a recipe to view its details.
      </p>
    {:else if $recipeQuery?.isLoading}
      <p class="text-[clamp(0.95rem,0.9rem+0.3vw,1.1rem)]">Loading recipe...</p>
    {:else if $recipeQuery?.error}
      <p class="text-error text-[clamp(0.95rem,0.9rem+0.3vw,1.1rem)]">Failed to load recipe.</p>
    {:else if $recipeQuery?.data?.meals}
      <div class="w-full md:w-[clamp(28rem,60vw,56rem)] mx-auto bg-base-100 rounded-2xl
                  p-[clamp(1rem,2.5vw,2rem)] shadow-md space-y-[clamp(0.75rem,2vw,1.25rem)]">
        <h3 class="text-center font-bold text-[clamp(1.25rem,1rem+1vw,1.8rem)] mb-1">
          {$recipeQuery.data.meals[0].strMeal}
        </h3>

        <img
          src="{$recipeQuery.data.meals[0].strMealThumb}"
          alt="{$recipeQuery.data.meals[0].strMeal}"
          class="mx-auto w-full max-w-[clamp(14rem,40vw,24rem)] h-auto
                 rounded-xl shadow border border-base-300 bg-base-200/40"
          decoding="async"
        />

        <!-- Meta + actions -->
        <div class="grid w-full items-center gap-3 md:grid-cols-3">
          <p class="text-[clamp(0.95rem,0.9rem+0.3vw,1.05rem)] md:justify-self-start">
            <strong>Category:</strong> {$recipeQuery.data.meals[0].strCategory}
          </p>

          <div class="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              class="btn btn-outline btn-warning
                     text-[clamp(0.85rem,0.8rem+0.3vw,1rem)]
                     h-[clamp(2.1rem,2rem+0.6vw,2.6rem)]"
              onclick={() => toggleFavorite($recipeQuery.data.meals[0].idMeal)}
            >
              {#if isFavorite($recipeQuery.data.meals[0].idMeal)}
                💔 Remove from Favorites
              {:else}
                ❤ Add to Favorites
              {/if}
            </button>

            <button
              type="button"
              class="btn btn-outline btn-warning
                     text-[clamp(0.85rem,0.8rem+0.3vw,1rem)]
                     h-[clamp(2.1rem,2rem+0.6vw,2.6rem)]"
              onclick={copyToClipboard}
            >
              Copy Recipe
            </button>
          </div>

          <p class="text-[clamp(0.95rem,0.9rem+0.3vw,1.05rem)] md:justify-self-end">
            <strong>Area:</strong> {$recipeQuery.data.meals[0].strArea}
          </p>
        </div>

        <!-- Instructions -->
        <div>
          <h4 class="font-semibold mt-2 mb-2 text-[clamp(1rem,0.95rem+0.4vw,1.15rem)]">Instructions:</h4>
          <ul class="space-y-2 list-none">
            {#each ($recipeQuery.data.meals[0]?.strInstructions?.split('.').filter((step) => step.trim() !== '') ?? []) as step, i (i)}
              <li class="flex items-start gap-2">
                <input
                  type="checkbox"
                  class="checkbox checkbox-accent
                         w-[clamp(1rem,0.9rem+0.4vw,1.25rem)]
                         h-[clamp(1rem,0.9rem+0.4vw,1.25rem)]"
                  checked={checkedInstructions.includes(i)}
                  onchange={() => toggleInstruction(i)}
                />
                <span
                  class:line-through={checkedInstructions.includes(i)}
                  class="text-[clamp(0.95rem,0.9rem+0.3vw,1.05rem)] leading-snug"
                >
                  {step.trim()}.
                </span>
              </li>
            {/each}
          </ul>
        </div>

        <!-- Ingredients -->
        <div>
          <h4 class="font-semibold mt-2 mb-2 text-[clamp(1rem,0.95rem+0.4vw,1.15rem)]">Ingredients:</h4>
          <ul class="space-y-1 list-none">
            {#each Array(20).fill(0).map((_, i) => i + 1) as i (i)}
              {#if $recipeQuery.data.meals[0]['strIngredient' + i]?.trim()}
                <li class="flex items-start gap-2">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-success
                           w-[clamp(1rem,0.9rem+0.4vw,1.25rem)]
                           h-[clamp(1rem,0.9rem+0.4vw,1.25rem)]"
                    checked={checkedIngredients.includes(i)}
                    onchange={() => toggleIngredient(i)}
                  />
                  <span
                    class:line-through={checkedIngredients.includes(i)}
                    class="text-[clamp(0.95rem,0.9rem+0.3vw,1.05rem)] leading-snug"
                  >
                    {$recipeQuery.data.meals[0]['strIngredient' + i]}
                    {#if $recipeQuery.data.meals[0]['strMeasure' + i]?.trim()}
                      {` - ${$recipeQuery.data.meals[0]['strMeasure' + i]}`}
                    {/if}
                  </span>
                </li>
              {/if}
            {/each}
          </ul>
        </div>

        <!-- YouTube Link -->
        {#if $recipeQuery.data.meals[0].strYoutube}
          <div class="text-center mt-4">
            <a
              href={$recipeQuery.data.meals[0].strYoutube}
              target="_blank"
              rel="noopener"
              class="btn btn-primary normal-case
                     text-[clamp(0.9rem,0.85rem+0.35vw,1.05rem)]
                     h-[clamp(2.3rem,2.1rem+0.7vw,2.8rem)]"
            >
              ▶ Watch on YouTube
            </a>
          </div>
        {/if}
      </div>
    {:else}
      <p class="text-error text-[clamp(0.95rem,0.9rem+0.3vw,1.1rem)]">No recipe found for the selected ID.</p>
    {/if}
  </div>
</div>

<style>
  .line-through {
    text-decoration: line-through;
    opacity: 0.6;
  }
</style>
