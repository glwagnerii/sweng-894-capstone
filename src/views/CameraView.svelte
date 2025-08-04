<script lang='ts'>
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
      stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoElement) { videoElement.srcObject = stream }
    }
    catch (error) {
      console.error('Error accessing webcam:', error)
      if (error instanceof Error) { errorMessage = 'Camera access denied or error: ' + error.message }
      else { errorMessage = 'Camera access denied or unknown error' }
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

    // Set your desired max width
    const maxWidth = 640
    const scale = Math.min(1, maxWidth / videoElement.videoWidth)
    const width = Math.round(videoElement.videoWidth * scale)
    const height = Math.round(videoElement.videoHeight * scale)

    canvasElement.width = width
    canvasElement.height = height

    const ctx = canvasElement.getContext('2d')
    if (!ctx) return
    ctx.drawImage(videoElement, 0, 0, width, height)
    const base64 = canvasElement.toDataURL('image/png', 0.7) // 0.7 = quality for jpeg, ignored for png

    const filename = getDateTimeFilename()
    const base64stipped = base64.replace(/^data:image\/\w+;base64,/, '')
    const inferResult: InferResult = await invoke('infer', { base64: base64stipped }) as InferResult
    dispatch({ type: 'app/viewResults', payload: { name: filename, base64, detections: inferResult.detections, timing: inferResult.timing } })
  }

  onDestroy(stopStream)
</script>

<div id="view-camera">
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {:else}
    <video class="w-full h-auto rounded-lg shadow-lg" bind:this={videoElement} autoplay playsinline>
      <track kind="captions" label="No captions available" />
      Video is not supported.
    </video>
    <div class="flex justify-center gap-4 mt-4">
      <button class="px-4 py-2 bg-primary text-onPrimary rounded" on:click={togglePausePlay}>
        {isPaused ? 'Retake' : 'Take Photo'}
      </button>
      {#if isPaused}
        <button class="px-4 py-2 bg-secondary text-onSecondary rounded" on:click={confirmPhoto}>
          Confirm
        </button>
      {/if}
    </div>
  {/if}
</div>

<style lang="postcss">
  @reference "tailwindcss";
</style>
