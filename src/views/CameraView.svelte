<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { invoke } from '@tauri-apps/api/core'
  import { useDispatch } from '../store'
  import { type InferResult } from '../store/appSlice'

  const dispatch = useDispatch()

  let videoElement: HTMLVideoElement | null = null
  let stream: MediaStream | null = null
  let errorMessage = ''
  let isPaused = false
  let canvasElement: HTMLCanvasElement | null = null

  onMount(async () => {
    try {
      // Prefer higher resolution and rear camera on mobile if available
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: { ideal: 'environment' }
        }
      }
      stream = await navigator.mediaDevices.getUserMedia(constraints)
      if (videoElement) {
        videoElement.srcObject = stream
        await videoElement.play().catch(() => {
          // Some browsers require a user gesture; we'll just show the button to start.
        })
      }
    } catch (error) {
      console.error('Error accessing webcam:', error)
      if (error instanceof Error) {
        errorMessage = 'Camera access denied or error: ' + error.message
      } else {
        errorMessage = 'Camera access denied or unknown error'
      }
    }
  })

  function stopStream() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      if (videoElement) { videoElement.srcObject = null }
    }
  }

  function togglePausePlay() {
    if (!videoElement) return
    isPaused = !videoElement.paused
    videoElement[isPaused ? 'pause' : 'play']()
  }

  function getDateTimeFilename() {
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `photo_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.png`
  }

  async function confirmPhoto() {
    if (!videoElement) return
    if (!canvasElement) { canvasElement = document.createElement('canvas') }

    // Scale capture to the displayed size (for crispness) but cap it to something reasonable
    const dpr = window.devicePixelRatio || 1
    const displayedCssWidth = Math.max(1, videoElement.clientWidth) // avoid 0 during initial layout
    const targetWidth = Math.min(1280, Math.max(640, Math.round(displayedCssWidth * dpr)))
    const scale = Math.min(1, targetWidth / Math.max(1, videoElement.videoWidth))
    const width = Math.round(videoElement.videoWidth * scale)
    const height = Math.round(videoElement.videoHeight * scale)

    canvasElement.width = width
    canvasElement.height = height

    const ctx = canvasElement.getContext('2d')
    if (!ctx) return
    ctx.drawImage(videoElement, 0, 0, width, height)

    // Quality param is ignored for PNG; kept for clarity
    const base64 = canvasElement.toDataURL('image/png', 0.92)

    const filename = getDateTimeFilename()
    const base64stripped = base64.replace(/^data:image\/\w+;base64,/, '')
    const inferResult = await invoke('infer', { base64: base64stripped }) as InferResult

    dispatch({
      type: 'app/viewResults',
      payload: {
        name: filename,
        base64,
        detections: inferResult.detections,
        timing: inferResult.timing
      }
    })
  }

  onDestroy(stopStream)
</script>

<!-- Outer wrapper centers the content; inner is exactly 75% of viewport width on md+ -->
<div class="w-full min-h-[100svh] flex justify-center items-start py-6">
  <div
    id="view-camera"
    class="w-[92vw] md:w-[75vw] flex flex-col items-center gap-[clamp(0.75rem,2.2vw,2rem)]"
  >
    {#if errorMessage}
      <p class="text-error text-[clamp(0.95rem,0.9rem+0.3vw,1.1rem)] text-center px-4">{errorMessage}</p>
    {:else}
      <!-- Video stage: rounded card that grows with window but respects viewport height -->
      <div
        class="w-full rounded-2xl shadow-lg overflow-hidden bg-base-300/40
               p-[clamp(0.5rem,1.2vw,1rem)]"
      >
        <div class="w-full flex justify-center">
          <video
            class="w-full max-h-[min(72vh,900px)] h-auto object-contain rounded-lg bg-base-100"
            bind:this={videoElement}
            autoplay
            playsinline
            muted
          >
            <track kind="captions" label="No captions available" />
            Video is not supported.
          </video>
        </div>
      </div>

      <!-- Controls scale with window -->
      <div class="flex justify-center gap-[clamp(0.5rem,1.2vw,1rem)]">
        <button
          class="btn btn-primary
                 text-[clamp(0.95rem,0.9rem+0.3vw,1.1rem)]
                 px-[clamp(0.9rem,1.2vw,1.5rem)]
                 h-[clamp(2.4rem,2.2rem+0.8vw,3rem)]"
          onclick={togglePausePlay}
        >
          {isPaused ? 'Retake' : 'Take Photo'}
        </button>

        {#if isPaused}
          <button
            class="btn btn-secondary
                   text-[clamp(0.95rem,0.9rem+0.3vw,1.1rem)]
                   px-[clamp(0.9rem,1.2vw,1.5rem)]
                   h-[clamp(2.4rem,2.2rem+0.8vw,3rem)]"
            onclick={confirmPhoto}
          >
            Confirm
          </button>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
</style>
