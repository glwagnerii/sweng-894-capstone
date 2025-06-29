<script lang="ts">
  import { onMount } from 'svelte'

  let recipes: { title: string, duration: string, ingredients: number, image: string }[] = []

  // Dummy recipes for now
  const allRecipes = [
    {
      title: 'Roasted Vegetable Medley',
      duration: '35 min',
      ingredients: 3,
      image: 'photos/veggie-medley.jpg',
    },
    {
      title: 'Stuffed Bell Peppers',
      duration: '50 min',
      ingredients: 3,
      image: 'photos/stuffed-peppers.jpg',
    },
    {
      title: 'Tomato and Garlic Soup',
      duration: '30 min',
      ingredients: 2,
      image: 'photos/tomato-soup.jpg',
    },
  ]

  onMount(() => {
    recipes = allRecipes // Future: filter based on identified ingredients
  })

  // const navigate = useNavigate()
</script>

<div class="p-4">

  <!-- Recipe list -->
  <div class="space-y-4" data-testid="recipe-view">
    {#each recipes as recipe (recipe.title)}
      <div class="flex bg-base-200 items-center rounded-xl p-3 shadow-md">
        <img src={recipe.image} alt={recipe.title} class="w-16 h-16 rounded-lg object-cover mr-4" />
        <div>
          <p class="font-semibold">{recipe.title}</p>
          <p class="text-sm">{recipe.duration} • {recipe.ingredients} ing</p>
        </div>
      </div>
    {/each}
  </div>
</div>
