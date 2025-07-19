<script lang="ts">
  import { onMount } from 'svelte'
  import { store, useSelector, useDispatch } from '../store'
  import { mealsApi } from '../store/api'
  import type { Detection } from '../store/appSlice'
  import Bbox from '../components/Bbox.svelte'

  const dispatch = useDispatch()

  // Image & Detection Results
  const imageName = useSelector((state) => state.app.results.name)
  const imageSrc = useSelector((state) => state.app.results.base64)
  const detections = useSelector((state) => state.app.results.detections)

  // Name-based Recipe Search
  const searchName = useSelector((state) => state.app.results.name)
  const ingredient = useSelector((state) => state.app.ingredient.name)
  const mealsQuery = useSelector((state) => {
    if (searchName) {
      return mealsApi.endpoints.getMealsByName.select($searchName)(state)
    } else if (ingredient) {
      return mealsApi.endpoints.getMealsByIngredient.select($ingredient)(state)
    } else {
      return {}
    }
  })

  onMount(() => {
    const state = store.getState().app
    if (state.results.name) {
      dispatch(mealsApi.endpoints.getMealsByName.initiate($searchName))
    } else if (state.ingredient.name) {
      dispatch(mealsApi.endpoints.getMealsByIngredient.initiate($ingredient))
    }
  })

  let imgEl: HTMLImageElement | null = null
  let imgLoaded = false

  function loadHandler(node: HTMLImageElement) {
    node.addEventListener('load', () => {
      imgLoaded = true
    })
    return {
      destroy() {
        node.removeEventListener('load', () => {
          imgLoaded = true
        })
      }
    }
  }

  function clickHandler(node: HTMLElement, det: Detection) {
    const handle = () => handleClick(det)
    node.addEventListener('click', handle)

    return {
      destroy() {
        node.removeEventListener('click', handle)
      }
    }
  }

  function handleClick(det: Detection) {
    dispatch({ type: 'app/viewMatches', payload: { name: det.class } })
  }

  function viewDetails(id: string) {
    dispatch({ type: 'app/viewDetails', payload: { id } })
  }

</script>

<div class="p-4 flex flex-col items-center space-y-6 font-sans">
  <h1 class="text-2xl font-bold mb-2">Results</h1>

  {#if $detections?.length > 0}
    <div class="text-lg mb-2">{ $imageName }</div>
    <!-- Image Preview with Bounding Boxes -->
    <div class="relative w-3/4 mx-auto">
      <img
        src={$imageSrc}
        alt="Detected Item"
        class="object-cover w-full h-auto rounded-xl shadow-md"
        use:loadHandler
      />
      {#if imgLoaded && $detections.length > 0}
        <svg class="absolute top-0 left-0 w-full h-full" viewBox={`0 0 ${imgEl?.width} ${imgEl?.height}`}>
          {#each $detections as det (det)}
            <Bbox det={det} imgEl={imgEl} />
          {/each}
        </svg>
      {/if}
    </div>

    <!-- Classification Results (list of detected classes) -->
    <div class="flex flex-wrap justify-center gap-2">
      {#each $detections as det (det)}
        <button
          class="font-semibold py-2 px-4 rounded-full text-sm bg-secondary text-white"
          use:clickHandler={det}
        >
          {det.class}
        </button>
      {/each}
    </div>

  {:else if $mealsQuery?.isLoading}
    <p>Loading meals...</p>
  {:else if $mealsQuery?.error}
    <p class="text-red-500">Failed to load meals.</p>
  {:else if $mealsQuery?.data?.meals?.length}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="recipe-view">
      {#each $mealsQuery.data.meals as recipe (recipe.idMeal)}
        <button
          type="button"
          class="flex bg-base-200 items-center rounded-xl p-3 shadow-md w-full text-left hover:bg-base-300 transition"
          onclick={() => viewDetails(recipe.idMeal)}
        >
          <img src={recipe.strMealThumb} alt={recipe.strMeal} class="w-16 h-16 rounded-lg object-cover mr-4" />
          <div>
            <p class="font-semibold">{recipe.strMeal}</p>
          </div>
        </button>
      {/each}
    </div>
  {:else}
    <p class="text-red-500">
      No results found for “{$searchName || $ingredient}”.
    </p>
  {/if}
</div>
