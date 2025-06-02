<script lang="ts">
  import { arch, locale, platform, type, version } from '@tauri-apps/plugin-os'
  import { writable } from 'svelte/store'

  const osInfo = writable<{
    platform?: string
    version?: string
    type?: string
    arch?: string
    locale?: string | null
  }>({})

  async function getOS() {
    osInfo.set({
      platform: platform(),
      version: version(),
      type: type(),
      arch: arch(),
      locale: await locale(),
    })
  }
</script>

<button on:click={getOS}>OS</button>

{#if Object.keys($osInfo).length}
  <p>
    <strong>Platform:</strong> {$osInfo.platform},
    <strong>Version:</strong> {$osInfo.version},
    <strong>Type:</strong> {$osInfo.type},
    <strong>Arch:</strong> {$osInfo.arch},
    <strong>Locale:</strong> {$osInfo.locale}
  </p>
{/if}
