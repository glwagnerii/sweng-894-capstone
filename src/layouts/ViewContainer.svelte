<script lang='ts'>
  import { useSelector } from '../store'
  import { views } from '../views'

  const selected = useSelector((state) => state.app.view.selected)
  const visible = useSelector((state) => state.app.view.visible)
  const Panel = $derived(views[$selected].component)
</script>

<!-- <div id='view' class='border-r flex flex-row flex-none absolute top-0 left-12 h-[var(--h-layout)] w-[var(--w-panel-left)] overflow-hidden {$visible ? 'visible' : 'hidden'}'> -->
<div id='view'>
  {#if $visible}<Panel />{/if}
</div>
