<script lang='ts'>
  import { useSelector } from '../store'
  import { PanelLeft1, PanelLeft2 } from '../panels'

  const map = { left1: PanelLeft1, left2: PanelLeft2 }

  const selected = useSelector((state) => state.app.panels.left.selected)
  const visible = useSelector((state) => state.app.panels.left.visible)
  const Panel = $derived(map[$selected])
</script>

<div id='leftpanel' class='border-r flex flex-row flex-none absolute top-0 left-12 h-[var(--h-layout)] w-[var(--w-panel-left)] overflow-hidden {$visible ? 'visible' : 'hidden'}'>
  <div class='flex-grow'>
    <div class='panel-titlebar flex justify-between items-center px-2 text-sm py-1'></div>
    {#if $visible}<Panel />{/if}
  </div>
</div>
