<script lang="ts">
  import { useSelector } from '../store'

  const imageSrc = useSelector((state) => state.app.selected.url)
  const classifications = useSelector((state) => state.app.selected.ingredients)
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
      <div class="font-semibold py-2 px-4 rounded-full text-sm bg-secondary">{item}</div>
    {/each}
  </div>
</div>
