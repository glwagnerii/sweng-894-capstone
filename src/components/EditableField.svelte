<script lang="ts">
  import { tick } from 'svelte'

  type EditableFieldProps = { id: string, label: string, value: string, onSave: (newName: string) => void }
  let { id, label, value = $bindable(), onSave }: EditableFieldProps = $props()

  let ref: HTMLInputElement | null = $state(null)
  let editing  = $state(false)

  const handleEdit = () => {
    editing = true
    tick().then(() => ref?.select())
  }

  const handleSave = () => {
    onSave(value.trim())
    editing = false
  }

</script>

<div>
  <label class="block font-semibold pb-2" for={id}>{label}</label>
  <div class="flex items-center px-3 py-2 bg-base-100">
    {#if editing}
      <input
        id={id}
        bind:this={ref}
        bind:value={value}
        class="input input-base flex-1 text-left"
        onkeydown={(e) => { e.stopPropagation(); if (e.key === 'Enter') handleSave() }}
      />
      <button class="btn btn-xs ml-2" onclick={handleSave}>✔️</button>
    {:else}
      <span class="flex-1 text-left text-base">{value}</span>
      <button class="btn btn-xs ml-2" onclick={handleEdit}>✏️</button>
    {/if}
  </div>
</div>
