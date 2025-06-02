<script lang="ts">
  import { load } from '@tauri-apps/plugin-store'
  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'

  const count: Writable<number> = getContext('count')

  async function saveCount() {
    const store = await load('store.json', { autoSave: false })
    await store.set('counter', $count)
    await store.save()
    console.log('Wrote value:', $count)
  }

  export async function loadCount() {
    const store = await load('store.json', { autoSave: false })
    const val = await store.get<number>('counter')
    if (typeof val === 'number') { count.set(val) }
    console.log('Read value:', val)
  }
</script>

<button on:click={saveCount}>Set Store</button>
<button on:click={loadCount}>Get Store</button>
