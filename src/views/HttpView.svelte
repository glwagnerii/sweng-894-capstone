<script lang="ts">
  import { fetch } from '@tauri-apps/plugin-http'
  import { writable } from 'svelte/store'

  interface Product {
    id: number
    title: string
    price: number
    description: string
    category: string
    image: string
    rating: {
      rate: number
      count: number
    }
  }

  const product = writable<Product | null>(null)
  const loading = writable(false)
  const error = writable<string | null>(null)

  async function getProduct() {
    loading.set(true)
    error.set(null)
    product.set(null)
    try {
      const response = await fetch('https://fakestoreapi.com/products/1', {
        method: 'GET',
      })
      const data = await response.json()
      product.set(data)
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
    <h3>{$product.title}</h3>
    <img src="{$product.image}" alt="{$product.title}" width="100" />
    <p>{$product.description}</p>
    <p><strong>Price:</strong> $ {$product.price}</p>
  </div>
{/if}
