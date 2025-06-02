<script lang="ts">
  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'

  const count: Writable<number> = getContext('count')
  function increment() { count.update((n) => n + 1) }
</script>

<button on:click={increment}>
  count is {$count}
</button>
