<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { invoke } from '@tauri-apps/api/core'

  let videoEl: HTMLVideoElement | null = null
  let stream: MediaStream | null = null
  let canvasEl: HTMLCanvasElement
  type Detection = { bbox: [number, number, number, number], class: string, score: number }
  let detections: Detection[] = []
  let errorMessage = ''

  // Start the camera when the component mounts
  onMount(async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoEl) { videoEl.srcObject = stream }
      window.addEventListener('resize', drawDetections)
    }
    catch (error) {
      console.error('Error accessing webcam:', error)
      if (error instanceof Error) { errorMessage = 'Camera access denied or error: ' + error.message }
      else { errorMessage = 'Camera access denied or unknown error' }
    }
  })

  onDestroy(() => {
    stopStream()
    window.removeEventListener('resize', drawDetections)
  })

  async function captureAndInfer() {
    // Stop the camera stream before inference

    // Capture current frame from video
    const ctx = canvasEl.getContext('2d')
    if (!ctx || !videoEl) return
    // Set canvas size to match video display size
    canvasEl.width = videoEl.videoWidth
    canvasEl.height = videoEl.videoHeight
    ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height)
    const dataUrl = canvasEl.toDataURL('image/jpeg')
    console.log(dataUrl)
    const base64 = dataUrl.split(',')[1] // <-- Pass this to backend

    stopStream()

    // Pass the base64 image to the Tauri backend
    try {
      detections = await invoke('infer_frame', { base64 }) // <-- Pass as { base64 }
      drawDetections()
    }
    catch (e) {
      errorMessage = 'Inference failed: ' + e
    }
  }

  function drawDetections() {
    if (!canvasEl || !videoEl) return
    // Always match canvas size to video display size
    canvasEl.width = videoEl.clientWidth
    canvasEl.height = videoEl.clientHeight
    const ctx = canvasEl.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)

    // Get scaling factors between original video and displayed video
    const videoWidth = videoEl.videoWidth
    const videoHeight = videoEl.videoHeight
    const scaleX = canvasEl.width / videoWidth
    const scaleY = canvasEl.height / videoHeight

    // Handle the case where detections is a result object (from Tauri)
    let detArray: Detection[] = []
    if (Array.isArray(detections)) {
      detArray = detections
    }
    // else if (detections && typeof detections === 'object' && 'Ok' in detections) {
    //   detArray = detections.Ok
    // }
    // else if (detections && typeof detections === 'object' && 'Err' in detections) {
    //   errorMessage = 'Inference failed: ' + detections.Err
    //   return
    // }

    for (const det of detArray) {
      // Scale bbox coordinates
      const [x, y, w, h] = det.bbox
      const sx = x * scaleX
      const sy = y * scaleY
      const sw = w * scaleX
      const sh = h * scaleY
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 2
      ctx.strokeRect(sx, sy, sw, sh)
      ctx.fillStyle = 'red'
      ctx.fillText(`${det.class} (${(det.score * 100).toFixed(1)}%)`, sx, sy - 5)
    }
  }

  function stopStream() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      if (videoEl) { videoEl.srcObject = null }
      stream = null
    }
  }
</script>

<div class="relative w-full max-w-2xl mx-auto">
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {:else}
    <video bind:this={videoEl} autoplay playsinline class="w-full h-auto rounded-lg shadow-lg" id="video-el">
      <track kind="captions" label="No captions available" />
      Video is not supported.
    </video>
    <canvas bind:this={canvasEl} class="absolute top-0 left-0 w-full h-full pointer-events-none rounded-lg" id="canvas-el"></canvas>
    <button on:click={captureAndInfer}>Detect</button>
  {/if}
</div>

<style lang="postcss">
  @reference "tailwindcss";
</style>
