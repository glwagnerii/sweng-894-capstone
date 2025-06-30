<script lang="ts">
  import { onMount } from 'svelte'

  type ImageFile = { name: string, url: string }
  let images: ImageFile[] = []

  const filenames = [
    'stuffed-peppers.jpg',
    'tomato-soup.jpg',
    'Ingredients1.jpg',
    'ingredients2.jpg',
    'ingredients3.jpg',
    'ingredients4.jpg',
    'ingredients5.jpg',
    'ingredients6.jpg',
    'ingredients7.jpg',
    'ingredients8.jpg',
    'ingredients9.jpg',
    'ingredients10.jpg',

    // Add more filenames here
  ]

  function loadFilenames() {
    images = filenames.map((name) => ({
      name,
      url: `/photos/${name}`,
    }))
  }

  onMount(loadFilenames)
</script>

<ul class="flex flex-wrap gap-4 p-0 list-none">
  {#each images as img (img.name)}
    <li class="flex flex-col items-center max-w-[200px]">
      <img src={img.url} alt={img.name} class="object-cover h-48 w-auto rounded shadow"/>
      <div class="mt-2 break-all text-center text-sm">{img.name}</div>
    </li>
  {/each}
</ul>
