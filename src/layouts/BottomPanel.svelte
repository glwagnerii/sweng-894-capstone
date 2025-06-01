<script lang='ts'>
    import { useSelector } from '../store'
    import { PanelBottom } from '../panels'
    import { type BottomPanelName } from '../constants'

    const map = { bottom: PanelBottom }

    const selected = useSelector<BottomPanelName>((state) => state.app.panels.bottom.selected)
    const visible = useSelector((state) => state.app.panels.bottom.visible)
    const Panel = $derived(map[$selected])
</script>

<div id='bottompanel' class='border-t flex flex-col flex-none absolute top-[calc(var(--h-layout)-var(--h-panel-bottom))] left-0 h-[var(--h-panel-bottom)] w-[var(--w-body)] ${visible ? 'visible' : 'hidden'}'>
    {#if $visible}<Panel />{/if}
</div>
