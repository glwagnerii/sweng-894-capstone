<script lang="ts">
  import { useSelector, useDispatch } from '../store'
  import type { Detection, Timing } from '../store/appSlice'
  import Bbox from '../components/Bbox.svelte'

  const dispatch = useDispatch()

  // Selectors for image and detections
  const imageName = useSelector((state) => state.app.results.name)
  const imageSrc = useSelector((state) => state.app.results.base64)
  const detections = useSelector((state) => state.app.results.detections)
  const timing = useSelector((state) => state.app.results.timing)
  console.log($timing)

  let imgEl: HTMLImageElement | null = null
  let imgLoaded = false

  function handleImgLoad() { if (imgEl) { imgLoaded = true } }

  function handleClick(det: Detection) { dispatch({ type: 'app/viewMatches', payload: { name: det.class } }) }
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

  <!-- Timing data -->
  <div class="w-3/4 mx-auto mt-4">
    <div class="collapse collapse-arrow bg-base-200 rounded-box">
      <input type="checkbox" class="peer" />
      <div class="collapse-title text-base font-semibold cursor-pointer leading-tight">
        Inference Timing ({$timing.total} ms)
      </div>
      <div class="collapse-content mt-0">
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div>Image Load:</div> <div class="text-right">{$timing.load} ms</div>
          <div>Model Init:</div> <div class="text-right">{$timing.init} ms</div>
          <div>Resize:</div> <div class="text-right">{$timing.resize} ms</div>
          <div>Padding:</div> <div class="text-right">{$timing.pad} ms</div>
          <div>ToTensor:</div> <div class="text-right">{$timing.tensor} ms</div>
          <div>Inference:</div> <div class="text-right">{$timing.infer} ms</div>
          <div>BBox:</div> <div class="text-right">{$timing.bbox} ms</div>
          <div>NMS:</div> <div class="text-right">{$timing.nms} ms</div>
        </div>
      </div>
    </div>
  </div>
</div>
