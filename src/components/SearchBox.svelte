<script lang="ts">

  type SearchBoxProps = { id: string, label: string, options: string[], value: string, placeholder: string, onSearch: (newValue: string) => void }
  let { id, label, options, value = $bindable(), placeholder, onSearch }: SearchBoxProps = $props()

  let ref: HTMLInputElement | null = $state(null)

  const filtered = $derived(() =>
    value
      ? options.filter((option) => option.toLowerCase().includes(value.toLowerCase()))
      : options,
  )

  let showList = $state(false)

  function selectOption(option: string) {
    console.log(option)
    value = option
    showList = false
  }
</script>

<div class="w-full max-w-md">
  {#if label}
    <label class="label" for={id}>
      <span class="label-text text-lg font-semibold">{label}</span>
    </label>
  {/if}
  <div class="flex gap-2">
    <div class="w-full max-w-xs">
      <input
        id={id}
        type="text"
        bind:this={ref}
        bind:value={value}
        {placeholder}
        autocomplete="on"
        tabindex="0"
        class="input input-base flex-1 text-left"
        onkeydown={(e) => { e.stopPropagation(); if (e.key === 'Enter') ref?.blur() }}
        onfocus={() => { showList = true } }
        onblur={() => setTimeout(() => showList = false, 100)}
      />
      {#if showList && filtered().length}
        <ul class="p-2 shadow bg-base-200 rounded-box w-full mt-1 z-10 flex flex-col max-h-48 overflow-y-auto overflow-x-hidden">
          {#each filtered() as option (option)}
            <li class="w-full">
              <button type="button" class="hover:bg-primary hover:text-primary-content cursor-pointer w-full text-left" onmousedown={() => selectOption(option) }>
                {option}
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
    <button class="btn btn-info" onclick={() => onSearch('hi')}>Search</button>
  </div>
</div>
