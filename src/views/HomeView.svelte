<script lang="ts">
  import { useDispatch } from '$store'   // path to your redux hooks
  const dispatch = useDispatch()        // get the dispatch function
</script>

<div class="flex flex-col items-center justify-start p-4 space-y-6 font-sans">
  <!-- logo -->
  <img
    src="photos/ClassifiCamLogo.png"
    alt="ClassifiCam Logo"
    class="w-64 h-60 object-cover rounded-xl shadow-md"
  />

  <!-- recent activity -->
  <div class="w-full max-w-xs mt-6">
    <div class="flex items-center justify-between mb-2">
      <!-- heading  : dark-green in light, white in dark -->
      <h2 class="text-md font-semibold text-primary dark:text-primary-content">
        Recent Activity
      </h2>

      <!-- link     : green in light, yellow in dark (accent) -->
      <button
        class="text-green-700 dark:text-yellow-400 underline hover:opacity-80 transition"
        on:click={() => dispatch({ type: 'app/viewHistory' })}
      >
        See more
      </button>
    </div>
  </div>
</div>
