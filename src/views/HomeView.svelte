<script lang="ts">
  import { writable } from 'svelte/store'
  import { useDispatch } from '../store'

  const dispatch = useDispatch()
  const searchTerm = writable('')
  const ingredientTerm = writable('')

  function searchByName() {
    if (!$searchTerm.trim()) return
    dispatch({ type: 'app/searchByName', payload: { name: $searchTerm } })
  }

  function searchByIngredient() {
    dispatch({ type: 'app/searchByIngredient', payload: { name: $ingredientTerm } })
  }
</script>

<div class="flex flex-col items-center justify-start p-4 space-y-6 font-sans">
  <img src="photos/ClassifiCamLogo.png" alt="ClassifiCam Logo" class="w-64 h-60 object-cover rounded-xl shadow-md" />

  <!-- ✅ Search Recipes by Name Section -->
  <div class="w-full max-w-md">
    <label class="label">
      <span class="label-text text-lg font-semibold">Search Recipe by Name</span>
    </label>
    <div class="flex gap-2">
      <input
        type="text"
        placeholder="e.g., Arrabiata"
        class="input input-bordered w-full"
        bind:value={$searchTerm}
        on:keydown={(e) => e.key === 'Enter' && searchByName()}
      />
      <button class="btn btn-info" on:click={searchByName}>Search</button>
    </div>
  </div>

  <!-- Ingredient Search Bar -->
  <div class="w-full max-w-md">
    <label class="label">
      <span class="label-text text-lg font-semibold">Search Recipes by Ingredient</span>
    </label>
    <div class="flex gap-2">
      <input
        type="text"
        placeholder="e.g., beef"
        class="input input-bordered w-full"
        bind:value={$ingredientTerm}
        on:keydown={(e) => e.key === 'Enter' && searchByIngredient()}
      />
      <button class="btn btn-info" on:click={searchByIngredient}>Search</button>
    </div>
  </div>

  <!-- ✅ Recent Activity Section -->
  <div class="w-full max-w-xs mt-6">
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-md font-semibold">Recent Activity</h2>
      <button
        class="text-sm underline transition"
        on:click={() => console.log('See more clicked')}
      >
        See more
      </button>
    </div>
  </div>
</div>
