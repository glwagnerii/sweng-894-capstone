<script lang="ts">
  import { fetch } from '@tauri-apps/plugin-http'
  import { writable } from 'svelte/store'

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
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata', {
        method: 'GET',
      })
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
</script>

<button on:click={getProduct}>HTTP</button>

{#if $loading}
  <p>Loading...</p>
{:else if $error}
  <p style="color: red">{$error}</p>
{:else if $product}
  <div>
    <h3>{$product.strMeal}</h3>
    <img src="{$product.strMealThumb}" alt="{$product.strMeal}" width="200" />
    <p><strong>Category:</strong> {$product.strCategory}</p>
    <p><strong>Area:</strong> {$product.strArea}</p>
    <p>{$product.strInstructions}</p>
    <h4>Ingredients:</h4>
    <ul>
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
    {#if $product.strYoutube}
      <p>
        <a href="{$product.strYoutube}" target="_blank" rel="noopener">Watch on YouTube</a>
      </p>
    {/if}
  </div>
{/if}
