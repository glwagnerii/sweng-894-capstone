<script lang="ts">
</script>

<div class="min-h-screen flex flex-col items-center justify-start p-4 bg-[#FAF9F6] space-y-6 text-gray-900 font-sans">

  <img src="photos/ClassifiCamLogo.png" alt="ClassifiCam Logo" class="w-64 h-60 object-cover rounded-xl shadow-md" />

  <div class="w-full max-w-xs mt-6">
    <div class="flex items-center justify-between mb-2">
        <h2 class="text-md font-semibold">Recent Activity</h2>
        <button
        class="text-sm text-green-700 underline hover:text-green-900 transition"
        on:click={() => console.log('See more clicked')}
        >
        See more
        </button>
    </div>
  </div>

</div>
