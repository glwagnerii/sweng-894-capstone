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
      name: 'ingredients4.jpg',
      ingredients: ['ham', 'rice', 'soy sauce', 'egg', 'green onion', 'carrot', 'sesame seeds', 'pea'],
    },
    {
      name: 'ingredients6.jpg',
      ingredients: ['corn', 'white beans', 'onions', 'chicken breast', 'jalapenos', 'cilantro', 'cumin', 'garlic'],
    },
    {
      name: 'ingredients7.jpg',
      ingredients: ['beef', 'onion', 'mushrooms', 'carrots', 'garlic', 'broth'],
    },    {
      name: 'ingredients8.jpg',
      ingredients: ['beef', 'bell pepper', 'mushroom', 'onion', 'bread', 'cheese'],
    },    {
      name: 'ingredients9.jpg',
      ingredients: ['salmon', 'tomato', 'feta cheese', 'potatoes', 'parsley', 'mustard', 'lemon'],
    },
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
