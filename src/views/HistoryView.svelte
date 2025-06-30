<script lang="ts">
  import { onMount } from 'svelte'

  interface HistoryItem {
    id: string;
    image: string;
    date: string;
    label?: string;
    confidence?: number;
  }

  let history: HistoryItem[] = []

  onMount(() => {
    const raw = localStorage.getItem('history')
    if (raw) {
      try {
        history = JSON.parse(raw)
      } catch {
        history = []
      }
    }
  })

  const clearHistory = () => {
    localStorage.removeItem('history')
    history = []
  }
</script>

<div class="p-4 flex flex-col gap-4 font-sans">

  <!-- Header / Actions -->
  <div class="flex items-center justify-between">
    <h1 class="text-lg font-semibold text-primary">
      History
    </h1>

    <div class="flex gap-2">

      {#if history.length}
        <button
          on:click={clearHistory}
          class="btn btn-sm btn-outline btn-error"
        >
          Clear
        </button>
      {/if}
    </div>
  </div>

  <!-- History List -->
  {#if history.length === 0}
    <p class="text-base-content/60">
      No items saved yet.
    </p>
  {:else}
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {#each history as item (item.id)}
        <div class="card bg-base-100 shadow-sm">
          <figure class="px-2 pt-2">
            <img
              src={item.image}
              alt="Captured"
              class="rounded-md object-cover max-h-40 w-full"
            />
          </figure>

          <div class="card-body p-2 text-center text-base-content">
            <p class="text-xs text-base-content/60">
              {new Date(item.date).toLocaleDateString()}
            </p>

            {#if item.label}
              <p class="text-sm font-medium">
                {item.label}
                {#if item.confidence !== undefined}
                  <span class="text-base-content/50 ml-1 text-xs">
                    ({Math.round(item.confidence * 100)}%)
                  </span>
                {/if}
              </p>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>