<script>

  function getRgbString(rgb) {
    if (rgb.startsWith('rgb')) return rgb
    return ''
  }

  const colors = [
    { class: 'active-text',        variable: '--active-text' },
    { class: 'button-face',        variable: '--button-face' },
    { class: 'button-text',        variable: '--button-text' },
    { class: 'canvas',             variable: '--canvas' },
    { class: 'canvas-text',        variable: '--canvas-text' },
    { class: 'field',              variable: '--field' },
    { class: 'field-text',         variable: '--field-text' },
    { class: 'gray-text',          variable: '--gray-text' },
    { class: 'highlight',          variable: '--highlight' },
    { class: 'highlight-text',     variable: '--highlight-text' },
    { class: 'link-text',          variable: '--link-text' },
    { class: 'mark',               variable: '--mark' },
    { class: 'mark-text',          variable: '--mark-text' },
    { class: 'selected-item',      variable: '--selected-item' },
    { class: 'selected-item-text', variable: '--selected-item-text' },
    { class: 'visited-text',       variable: '--visited-text' },
    { class: 'cc-red',             variable: '--cc-red' },
    { class: 'cc-black',           variable: '--cc-black' },
    { class: 'cc-white',           variable: '--cc-white' },
    { class: 'cc-grey',            variable: '--cc-grey' },
    { class: 'cc-lightgrey',       variable: '--cc-lightgrey' },
    { class: 'cc-blue',            variable: '--cc-blue' },
    { class: 'cc-lightblue',       variable: '--cc-lightblue' },
    { class: 'cc-green',           variable: '--cc-green' },
    { class: 'cc-lightgreen',      variable: '--cc-lightgreen' },
    { class: 'cc-orange',          variable: '--cc-orange' },
    { class: 'cc-yellow',          variable: '--cc-yellow' },
  ]

  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'

  const colorHexes = writable({})

  function updateHexes() {
    const hexes = {}
    colors.forEach((color) => {
      const div = document.createElement('div')
      div.className = `bg-${color.class}`
      div.style.display = 'none'
      document.body.appendChild(div)
      const style = getComputedStyle(div)
      const rgb = style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent'
        ? style.backgroundColor
        : style.color
      hexes[color.class] = getRgbString(rgb) || ''
      document.body.removeChild(div)
    })
    colorHexes.set(hexes)
  }

  onMount(() => {
    updateHexes()

    // Watch for changes to the html's class attribute (for dark mode toggling)
    const observer = new MutationObserver(() => {
      updateHexes()
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  })
</script>

<div class="p-4">
  <h2 class="text-xl font-bold mb-4">System Colors</h2>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {#each colors.slice(0, 16) as color (color.class)}
      <div class="flex flex-col items-center">
        <div class={`bg-${color.class} w-16 h-16 rounded shadow-sm`}></div>
        <span class="mt-2 text-sm">{color.class}</span>
        <span class="text-xs text-gray-500 break-all text-center">
          {#await $colorHexes then hexes}
            {hexes[color.class]}
          {/await}
        </span>
      </div>
    {/each}
  </div>
  <div class="h-4"></div>
  <h2 class="text-xl font-bold mb-4">Custom Colors</h2>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {#each colors.slice(16) as color (color.class)}
      <div class="flex flex-col items-center">
        <div class={`bg-${color.class} w-16 h-16 rounded shadow-sm` + (color.class === 'cc-white' ? ' border' : '')}></div>
        <span class="mt-2 text-sm">{color.class}</span>
        <span class="text-xs text-gray-500 break-all text-center">
          {#await $colorHexes then hexes}
            {hexes[color.class]}
          {/await}
        </span>
      </div>
    {/each}
  </div>
</div>
