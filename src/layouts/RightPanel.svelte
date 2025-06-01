<script lang='ts'>
  import { useSelector } from '../store'
  import { PanelRight } from '../panels'

  const map = { right: PanelRight }

  const selected = useSelector((state) => state.app.panels.right.selected)
  const visible = useSelector((state) => state.app.panels.right.visible)
  const Panel = $derived(map[$selected])
</script>

<div id='rightpanel' class='border-l flex flex-row flex-none absolute top-0 left-[calc(100vw-var(--w-panel-right))] h-[var(--h-layout)] w-[var(--w-panel-right)] {$visible ? 'visible' : 'hidden'}'>
  <div class='flex-grow'>
    <div class='panel-titlebar flex justify-between items-center px-2 text-sm py-1'></div>
    {#if $visible}<Panel />{/if}
  </div>
</div>
