<script lang="ts">
  import { useSelector, useDispatch } from '../store'
  const dispatch = useDispatch()

  const imageSrc = useSelector((state) => state.app.selected.url)
  const classifications = useSelector((state) => state.app.selected.ingredients)

  function handleClick(item: string) {
    console.log(item)
    dispatch({ type: 'app/viewMatches', payload: { name: item, ingredients: $classifications } })
  }
</script>

<div class="p-4 flex flex-col items-center space-y-6 font-sans">
  <h1 class="text-2xl font-bold mb-2">Classification Results</h1>

  <!-- Image Preview -->
  <img
    src={$imageSrc}
    alt="Classified Item"
    class="object-cover h-48 w-auto rounded-xl shadow-md"
  />

  <!-- Classification Results -->
  <div class="flex flex-wrap justify-center gap-2">
    {#each $classifications as item (item)}
      <button
        class="font-semibold py-2 px-4 rounded-full text-sm bg-secondary hover:bg-secondary-focus transition"
        on:click={() => handleClick(item)}
      >
        {item}
      </button>
    {/each}
  </div>
</div>
