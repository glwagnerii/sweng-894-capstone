<script lang="ts">
  import { fetch } from '@tauri-apps/plugin-http'
  import { writable } from 'svelte/store'
  import { useSelector } from '../store'
  import { onMount } from 'svelte'

  const recipeId = useSelector((state) => state.app.recipe.id)
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${$recipeId}`

  type Product = {
    idMeal: string
    strMeal: string
    strDrinkAlternate: string | null
    strCategory: string
    strArea: string
    strInstructions: string
    strMealThumb: string
    strTags: string | null
    strYoutube: string
    [key: string]: string | null // for dynamic ingredient/measure fields
  }

  const product = writable<Product | null>(null)
  const loading = writable(false)
  const error = writable<string | null>(null)

  async function getProduct() {
    loading.set(true)
    error.set(null)
    product.set(null)
    try {
      const response = await fetch(url, { method: 'GET' })
      const data = await response.json()
      product.set(data.meals ? data.meals[0] : null)
    }
    catch (e) {
      error.set('Failed to fetch product')
      console.log(e)
    }
    finally {
      loading.set(false)
    }
  }

  onMount(() => {
    getProduct()
  })
</script>

{#if $loading}
  <p class="text-info">Loading...</p>
{:else if $error}
  <p class="text-error">{$error}</p>
{:else if $product}
  <div class="max-w-xl mx-auto bg-base-100 rounded-xl shadow-lg p-6 space-y-4">
    <h3 class="text-2xl font-bold text-center mb-2">{$product.strMeal}</h3>
    <img
      src="{$product.strMealThumb}"
      alt="{$product.strMeal}"
      class="mx-auto w-80 h-auto rounded-lg shadow border-2 border-base-300"
    />
    <div class="flex flex-col md:flex-row md:justify-between gap-2 text-base-content">
      <p><strong>Category:</strong> {$product.strCategory}</p>
      <p><strong>Area:</strong> {$product.strArea}</p>
    </div>
    <p class="whitespace-pre-line">{$product.strInstructions}</p>
    <div>
      <h4 class="font-semibold mt-4 mb-2">Ingredients:</h4>
      <ul class="list-disc list-inside space-y-1">
        {#each Array(20).fill(0).map((_, i) => i + 1) as i (i)}
          {#if $product['strIngredient' + i] && $product['strIngredient' + i]?.trim() !== ''}
            <li>
              {$product['strIngredient' + i]}
              {#if $product['strMeasure' + i] && $product['strMeasure' + i]?.trim() !== ''}
                - {$product['strMeasure' + i]}
              {/if}
            </li>
          {/if}
        {/each}
      </ul>
    </div>
    {#if $product.strYoutube}
      <p class="mt-4 text-center">
        <a
          href="{$product.strYoutube}"
          target="_blank"
          rel="noopener"
          class="link link-primary"
        >
          Watch on YouTube
        </a>
      </p>
    {/if}
  </div>
{/if}
