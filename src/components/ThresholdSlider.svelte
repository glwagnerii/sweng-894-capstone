<script lang="ts">
  type ThresholdSliderProps = { id: string, label: string, value: number, onchange: () => void }
  let { id, label, value = $bindable(), onchange }: ThresholdSliderProps = $props()
</script>

<div class="my-0">
  <label class="block font-semibold" for={id}>{label}</label>
  <div class="flex items-center">
    <input id={id} type="range"  min={0} max={100} step={1} bind:value onchange={onchange} class="range range-accent flex-1 h-4 pr-3"/>
    <input         type="number" min={0} max={100} step={1} bind:value onchange={onchange} class="input input-bordered w-20 text-right"/>
  </div>
</div>
