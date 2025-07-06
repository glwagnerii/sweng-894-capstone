<script lang="ts">
  import { useSelector, useDispatch } from '../store'
  import type { Detection } from '../store/appSlice'

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
      <svg
        class="absolute top-0 left-0"
        style="pointer-events: none;"
        width={imgEl?.width}
        height={imgEl?.height}
      >
        {#each $detections as det (det)}
          <g>
            <rect
              x={det.bbox[0] * (imgEl.width / imgEl.naturalWidth)}
              y={det.bbox[1] * (imgEl.height / imgEl.naturalHeight)}
              width={det.bbox[2] * (imgEl.width / imgEl.naturalWidth)}
              height={det.bbox[3] * (imgEl.height / imgEl.naturalHeight)}
              fill="none"
              stroke="red"
              stroke-width="2"
            />
            <!-- Label background -->
            <rect
              x={det.bbox[0] * (imgEl.width / imgEl.naturalWidth)}
              y={det.bbox[1] * (imgEl.height / imgEl.naturalHeight)}
              width={det.class.length * 8 + 16}
              height="16"
              fill="red"
              fill-opacity="0.6"
              rx="4"
              ry="4"
            />
            <text
              x={det.bbox[0] * (imgEl.width / imgEl.naturalWidth) + 8}
              y={det.bbox[1] * (imgEl.height / imgEl.naturalHeight) + 12}
              fill="white"
              font-size="14"
              font-weight="bold"
              stroke="black"
              stroke-width="0.5"
            >
              {det.class}
            </text>
          </g>
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
