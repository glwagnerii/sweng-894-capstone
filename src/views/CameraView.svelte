<script>
  import { onMount, onDestroy } from 'svelte';
  let captured = false;

  const constraints = {
    audio: true,
    video: true,
  };

  function handleSuccess(stream) {
    const video = document.querySelector('video');
    window.stream = stream;
    video.srcObject = stream;
  }

  function handleError(error) {
    console.log('Error accessing media devices:', error);
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleSuccess(stream);
    } catch (e) {
      handleError(e);
    }
  }

  function capturePhoto() {
    captured = true; // Simulate preview logic
  }

  onMount(() => {
    startCamera();
  });

  onDestroy(() => {
    window.stream?.getTracks().forEach(track => track.stop());
  });
</script>

<div class="flex flex-col gap-2" data-testid="camera-feed">
  <video id="localVideo" autoplay playsinline>
    <track kind="captions" />
  </video>

  <button
    class="bg-green-600 text-white px-4 py-2 mt-4 rounded"
    on:click={capturePhoto}
    data-testid="capture-button"
  >
    Capture
  </button>

  {#if captured}
    <div class="mt-4 p-2 bg-gray-200 text-center rounded" data-testid="photo-preview">
      Preview simulated
    </div>
  {/if}
</div>