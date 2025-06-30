<script lang="ts">
  import { onMount } from 'svelte'
  import { useDispatch } from '../store'

  type ImageFile = { name: string, url: string, ingredients: string[] }
  let images: ImageFile[] = []

  // Import your redux slice action
  // import { selectImage } from '../store/yourSlice'

  // Get the dispatch function from your redux integration
  const dispatch = useDispatch()

  const files = [
    {
      name: 'stuffed-peppers.jpg',
      ingredients: ['bell peppers', 'rice', 'ground beef', 'tomato sauce', 'cheese'],
    },
    {
      name: 'tomato-soup.jpg',
      ingredients: ['tomatoes', 'onion', 'garlic', 'vegetable broth', 'cream'],
    },
    // Add more objects here
  ]

  function loadFilenames() {
    images = files.map((file) => ({
      name: file.name,
      url: `/photos/${file.name}`,
      ingredients: file.ingredients,
    }))
  }

  function handleImageClick(img: ImageFile) {
    dispatch({ type: 'app/selectImage', payload: img })
  }

  onMount(loadFilenames)
</script>

<ul class="flex flex-wrap gap-4 p-0 list-none">
  {#each images as img (img.name)}
    <li class="flex flex-col items-center max-w-[200px]">
      <button
        type="button"
        class="p-0 border-none bg-transparent cursor-pointer focus:outline-none"
        on:click={() => handleImageClick(img)}
        aria-label={`Select image ${img.name}`}
      >
        <img
          src={img.url}
          alt={img.name}
          class="object-cover h-48 w-auto rounded shadow"
        />
      </button>
      <div class="mt-2 break-all text-center text-sm">{img.name}</div>
    </li>
  {/each}
</ul>
