<script lang="ts">
  import { useSelector, useDispatch } from '../store'
  import type { Detection } from '../store/appSlice'
  import Bbox from '../components/Bbox.svelte'

  const dispatch = useDispatch()

  // Selectors for image and detections
  const imageName = useSelector((state) => state.app.results.name)
  const imageSrc = useSelector((state) => state.app.results.base64)
  const detections = useSelector((state) => state.app.results.detections)

  let imgEl: HTMLImageElement | null = null
  let imgLoaded = false

  function handleImgLoad() { if (imgEl) { imgLoaded = true } }

  function handleClick(det: Detection) {
    console.log(det)
    dispatch({ type: 'app/viewMatches', payload: { name: det.class } })
  }
</script>

<div class="p-4 flex flex-col items-center space-y-6 font-sans">
  <h1 class="text-2xl font-bold mb-2">Detection Results</h1>
  <div class="text-lg mb-2">{ $imageName }</div>

  <!-- Image Preview with Bounding Boxes -->
  <div class="relative w-3/4 mx-auto">
    <img
      src={$imageSrc}
      alt="Detected Item"
      class="object-cover w-full h-auto rounded-xl shadow-md"
      bind:this={imgEl}
      on:load={handleImgLoad}
      style="display: block;"
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
      <button class="font-semibold py-2 px-4 rounded-full text-sm bg-secondary text-white" on:click={() => handleClick(det)}>
        {det.class}
      </button>
    {/each}
  </div>
</div>
