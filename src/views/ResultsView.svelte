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
  const resultsQuery = useSelector((state) =>
    mealsApi.endpoints.getMealsByName.select(state.app.results.name)(state)
  )

  let imgEl: HTMLImageElement | null = null
  let imgLoaded = false

  onMount(() => {
    const name = store.getState().app.results.name
    if (typeof name === 'string' && name.trim().length > 0) {
      dispatch(mealsApi.endpoints.getMealsByName.initiate(name))
    }
  })

  function handleImgLoad() {
    if (imgEl) {
      imgLoaded = true
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
    <!-- Image + Bounding Boxes -->
    <div class="text-lg mb-2">{ $imageName }</div>
    <div class="relative w-3/4 mx-auto">
      <img
        src={$imageSrc}
        alt="Detected Item"
        class="object-cover w-full h-auto rounded-xl shadow-md"
        bind:this={imgEl}
        on:load={handleImgLoad}
        style="display: block;"
      />
      {#if imgLoaded}
        <svg class="absolute top-0 left-0 w-full h-full" viewBox={`0 0 ${imgEl?.width} ${imgEl?.height}`}>
          {#each $detections as det (det)}
            <Bbox det={det} imgEl={imgEl} />
          {/each}
        </svg>
      {/if}
    </div>

    <!--Detected Ingredient Buttons -->
    <div class="flex flex-wrap justify-center gap-2 mt-4">
      {#each $detections as det (det)}
        <button
          class="font-semibold py-2 px-4 rounded-full text-sm bg-secondary text-white"
          on:click={() => handleClick(det)}>
          {det.class}
        </button>
      {/each}
    </div>

  {:else if $resultsQuery?.isLoading}
    <p class="text-gray-500">Searching for recipes...</p>

  {:else if $resultsQuery?.data?.meals}
    <!-- Recipe Search Results -->
    <div class="w-full max-w-2xl space-y-4">
      {#each $resultsQuery.data.meals as meal (meal.idMeal)}
        <div class="bg-base-200 rounded shadow p-4 flex gap-4 items-center cursor-pointer hover:bg-base-300 transition"
             on:click={() => viewDetails(meal.idMeal)}>
          <img src={meal.strMealThumb} alt={meal.strMeal} class="w-24 h-24 rounded object-cover" />
          <div>
            <h3 class="font-semibold text-lg">{meal.strMeal}</h3>
            <p class="text-sm text-gray-500">{meal.strArea} - {meal.strCategory}</p>
          </div>
        </div>
      {/each}
    </div>

  {:else}
    <p class="text-red-500">No results found for “{searchName}”.</p>
  {/if}
</div>
