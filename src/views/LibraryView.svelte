<script lang="ts">
  import { readDir, readFile, BaseDirectory } from '@tauri-apps/plugin-fs'
  import { onMount } from 'svelte'

  type ImageFile = { name: string, dataUrl: string }
  let images: ImageFile[] = []

  async function loadFilenames() {
    try {
      const entries = await readDir('resources/images', { baseDir: BaseDirectory.Resource })
      images = await Promise.all(
        entries.map(async (entry) => {
          const fileData = await readFile(`resources/images/${entry.name}`, { baseDir: BaseDirectory.Resource })
          // fileData is Uint8Array, convert to base64
          const base64 = btoa(String.fromCharCode(...fileData))
          return {
            name: entry.name,
            dataUrl: `data:image/*;base64,${base64}`,
          }
        }),
      )
    }
    catch (error) {
      console.error('Failed to load filenames', error)
    }
  }

  onMount(loadFilenames)
</script>

<ul class="flex flex-wrap gap-4 p-0 list-none">
  {#each images as img (img.name)}
    <li class="flex flex-col items-center max-w-[200px]">
      <img
        src={img.dataUrl}
        alt={img.name}
        class="max-w-full max-h-[200px] rounded shadow"
      />
      <div class="mt-2 break-all text-center text-sm">{img.name}</div>
    </li>
  {/each}
</ul>
