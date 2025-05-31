<script lang="ts">
  import { openUrl } from '@tauri-apps/plugin-opener';

  async function openGoogle() {
    await openUrl('https://www.google.com');
  }
</script>

<button on:click={openGoogle}>Opener</button>
