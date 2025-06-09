<script>
  import { onMount, onDestroy } from 'svelte'

  const constraints = (window.constraints = {
    audio: true,
    video: true,
  })

  function handleSuccess(stream) {
    const video = document.querySelector('video')
    window.stream = stream
    video.srcObject = stream
  }

  function handleError(error) {

  }

  onMount(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      handleSuccess(stream)
    }
    catch (e) {
      if (e.name === 'ConstraintNotSatisfiedError') {
        const v = constraints.video
        console.log(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`)
      }
      else if (e.name === 'PermissionDeniedError') {
        console.log(
          'Permissions have not been granted to use your camera and '
          + 'microphone, you need to allow the page access to your devices in '
          + 'order for the demo to work.',
        )
      }
      console.log(`getUserMedia error: ${e.name}`, e)
    }
  })

  onDestroy(() => { window.stream.getTracks().forEach(function (track) { track.stop() }) })
</script>

<div class="flex flex-col gap-2">
  <video id="localVideo" autoplay playsinline>
    <track kind="captions" />
  </video>
</div>
