<script lang="ts">
  export let imageSrc: string = 'photos/veggies.png'
  export let classifications: string[] = ['Carrot', 'Bell pepper', 'Tomato', 'Garlic']

</script>

<div class="min-h-screen bg-[#FAF9F6] p-4 flex flex-col items-center space-y-6 font-sans text-gray-900">
  <h1 class="text-2xl font-bold mb-2">Classification Results</h1>

  <!-- Image Preview -->
  <img src={imageSrc} alt="Classified Item" class="w-full object-cover rounded-xl shadow-md" />

  <!-- Classification Results -->
  <div class="flex flex-wrap justify-center gap-2">
    {#each classifications as item (item)}
      <div class="bg-green-800 text-white font-semibold py-2 px-4 rounded-full text-sm">{item}</div>
    {/each}
  </div>

</div>
