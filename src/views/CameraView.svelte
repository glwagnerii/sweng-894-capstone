<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { detectPlatform } from '../store/appSlice'
  import { invoke } from '@tauri-apps/api/core'
  import { useDispatch } from '../store'

  const dispatch = useDispatch()

  let videoElement: HTMLVideoElement | null = null
  let canvasElement: HTMLCanvasElement | null = null
  let stream: MediaStream | null = null
  let errorMessage = ''
  let isMobile = false
  let videoDevices: MediaDeviceInfo[] = []
  let selectedDeviceId: string = ''

  let previewImage: string | null = null
  let isPreviewing = false

  onMount(() => {
    const platform = detectPlatform()           // Get platform string
    isMobile = platform === 'ios' || platform === 'android' // Set boolean
  })

  function stopStream() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      if (videoElement) videoElement.srcObject = null
    }
  }

  async function startStream(deviceId: string) {
    stopStream()
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
      })
      if (videoElement) {
        videoElement.srcObject = stream
      }
    }
    catch (error) {
      console.error('Error starting camera with deviceId', deviceId, error)

      // Try fallback if constraint was too strict
      if (error instanceof DOMException && (error.name === 'OverconstrainedError' || error.name === 'NotFoundError')) {
        try {
          console.warn('Falling back to default camera...')
          stream = await navigator.mediaDevices.getUserMedia({ video: true })
          if (videoElement) {
            videoElement.srcObject = stream
          }
          errorMessage = ''
          return
        }
        catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
          errorMessage
            = fallbackError instanceof Error ? fallbackError.message : 'Fallback camera error'
        }
      }
      else {
        errorMessage
          = error instanceof Error ? 'Camera error: ' + error.message : 'Unknown camera error'
      }
    }
  }

  async function confirmPhoto() {
    if (!previewImage) return

    // Strip data-URI prefix → base-64 only
    const base64 = previewImage.replace(/^data:image\/\w+;base64,/, '')

    /* ask backend for “recentN.png” */
    let filename = ''
    try {
      filename = await invoke('next_available_photo_name') as string
      await invoke('save_photo_base64', { base64, filename })
    }
    catch (err) {
      console.error('Failed saving photo', err)
      errorMessage = 'Could not save photo'
      return
    }

    /* persist the file  */
    await invoke('save_photo_base64', { base64, filename })

    /* run model inference (returns bounding-boxes, etc.) */
    const detections = await invoke('infer_base64', { base64 })

    /* update global state & route to Results view */
    dispatch({
      type   : 'app/viewResults',
      payload: { name: filename, base64: previewImage, detections },
    })

    /* reset preview state */
    previewImage  = null
    isPreviewing  = false
  }

  async function initCamera() {
    const platform = detectPlatform()
    const isMobile = platform === 'android' || platform === 'ios'

    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      videoDevices = devices.filter((d) => d.kind === 'videoinput')

      if (isMobile) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        if (videoElement) videoElement.srcObject = stream
      }
      else if (videoDevices.length > 0) {
        selectedDeviceId = videoDevices[0].deviceId
        await startStream(selectedDeviceId)
      }
    }
    catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Unknown initialization error'
    }
  }

  function handleCameraChange(event: Event) {
    const target = event.target as HTMLSelectElement
    selectedDeviceId = target.value
    startStream(selectedDeviceId)
  }

  function takePhoto() {
    if (!videoElement || !canvasElement) {
      console.warn('Missing video or canvas element.')
      return
    }

    const context = canvasElement.getContext('2d')
    if (!context) {
      console.warn('Canvas context not available.')
      return
    }

    canvasElement.width = videoElement.videoWidth
    canvasElement.height = videoElement.videoHeight
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height)

    previewImage = canvasElement.toDataURL('image/png')
    isPreviewing = true
  }

  function retakePhoto() {
    isPreviewing = false
    previewImage = null
  }

  // function togglePausePlay() {
  //   if (!videoElement) return
  //   if (videoElement.paused) {
  //     videoElement.play()
  //     isPaused = false
  //   }
  //   else {
  //     videoElement.pause()
  //     isPaused = true
  //   }
  // }

  onMount(initCamera)
  onDestroy(stopStream)
</script>

<div>
  {#if errorMessage}
    <p class="error text-red-600 text-sm">{errorMessage}</p>
  {:else if isPreviewing && previewImage}
    <div class="text-center">
      <img src={previewImage} alt="Preview" class="rounded shadow mx-auto max-w-full max-h-[70vh]" />
      <div class="mt-4 flex justify-center gap-4">
        <button on:click={confirmPhoto} class="px-4 py-2 bg-green-700 text-white rounded">Confirm</button>
        <button on:click={retakePhoto} class="px-4 py-2 bg-yellow-600 text-white rounded">Retake</button>
      </div>
    </div>
  {:else}
    <video bind:this={videoElement} autoplay playsinline class="w-full h-auto rounded shadow">
      <track kind="captions" label="camera stream" />
    </video>

    <canvas bind:this={canvasElement} class="hidden"></canvas>

    {#if !isMobile && videoDevices.length > 1}
      <!-- Give the section a little horizontal breathing-room on desktop -->
      <div class="mt-6 max-w-sm mx-auto">
        <!-- DaisyUI label style -->
        <label
          for="cameraSelect"
          class="label p-0 mb-1 text-base-content text-sm font-medium"
        >
          Select Camera
        </label>

        <!-- DaisyUI “select” component -->
        <select
          id="cameraSelect"
          bind:value={selectedDeviceId}
          on:change={handleCameraChange}
          class="select select-bordered w-full"
        >
          {#each videoDevices as device (device.deviceId)}
            <option value={device.deviceId}>
              {device.label || 'Camera'}
            </option>
          {/each}
        </select>
      </div>
    {/if}

    <div class="mt-4 text-center">
      <button
        on:click={takePhoto}
        class="px-5 py-2 rounded text-white bg-green-700 hover:bg-green-800 border-2 border-[#d2b48c] shadow-md"
      >
        Take Photo
      </button>
    </div>
  {/if}
</div>

<style lang="postcss">
  @reference "tailwindcss";
</style>
