<script lang='ts'>
  import { onMount, onDestroy } from 'svelte'

  let videoElement: HTMLVideoElement | null = null
  let stream: MediaStream | null = null
  let errorMessage = ''
  let isPaused = false

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
    if (videoElement.paused) {
      videoElement.play()
      isPaused = false
    }
    else {
      videoElement.pause()
      isPaused = true
    }
  }

  onDestroy(stopStream)
</script>

<div>
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {:else}
    <video class="w-full h-auto rounded-lg shadow-lg" bind:this={videoElement} autoplay>
      <track kind="captions" label="No captions available" />
      Video is not supported.
    </video>
    <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded" on:click={togglePausePlay}>
      {isPaused ? 'Play' : 'Pause'}
    </button>
  {/if}
</div>

<style lang="postcss">
  @reference "tailwindcss";
</style>
