<script lang="ts">
  import { useSelector, useDispatch } from '../store'
  import { mealsApi } from '../store/api'

  const dispatch = useDispatch()

  const recipeId = useSelector((state) => state.app.recipe.id)
  const recipeQuery = useSelector((state) => mealsApi.endpoints.getMealById.select($recipeId)(state))
  $effect(() => { dispatch(mealsApi.endpoints.getMealById.initiate($recipeId)) })

</script>

{#if $recipeQuery?.isLoading}
  <p>Loading recipe...</p>
{:else if $recipeQuery?.error}
  <p class="text-red-500">Failed to load recipe.</p>
{:else if $recipeQuery?.data?.meals}
  <div class="max-w-xl mx-auto bg-base-100 rounded-xl shadow-lg p-6 space-y-4">
    <h3 class="text-2xl font-bold text-center mb-2">{$recipeQuery.data.meals[0].strMeal}</h3>
    <img
      src="{$recipeQuery.data.meals[0].strMealThumb}"
      alt="{$recipeQuery.data.meals[0].strMeal}"
      class="mx-auto w-80 h-auto rounded-lg shadow border-2 border-base-300"
    />
    <div class="flex flex-col md:flex-row md:justify-between gap-2 text-base-content">
      <p><strong>Category:</strong> {$recipeQuery.data.meals[0].strCategory}</p>
      <p><strong>Area:</strong> {$recipeQuery.data.meals[0].strArea}</p>
    </div>
    <p class="whitespace-pre-line">{$recipeQuery.data.meals[0].strInstructions}</p>
    <div>
      <h4 class="font-semibold mt-4 mb-2">Ingredients:</h4>
      <ul class="list-disc list-inside space-y-1">
        {#each Array(20).fill(0).map((_, i) => i + 1) as i (i)}
          {#if $recipeQuery.data.meals[0]['strIngredient' + i] && $recipeQuery.data.meals[0]['strIngredient' + i]?.trim() !== ''}
            <li>
              {$recipeQuery.data.meals[0]['strIngredient' + i]}
              {#if $recipeQuery.data.meals[0]['strMeasure' + i] && $recipeQuery.data.meals[0]['strMeasure' + i]?.trim() !== ''}
                - {$recipeQuery.data.meals[0]['strMeasure' + i]}
              {/if}
            </li>
          {/if}
        {/each}
      </ul>
    </div>
    {#if $recipeQuery.data.meals[0].strYoutube}
      <p class="mt-4 text-center">
        <a
          href="{$recipeQuery.data.meals[0].strYoutube}"
          target="_blank"
          rel="noopener"
          class="link link-primary"
        >
          Watch on YouTube
        </a>
      </p>
    {/if}
  </div>
{:else}
  <p>No recipe found.</p>
{/if}
