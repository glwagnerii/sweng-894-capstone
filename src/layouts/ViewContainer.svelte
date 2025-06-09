<script lang='ts'>
  import { useSelector } from '../store'
  import { views } from '../views'

  const selected = useSelector((state) => state.app.view.selected)
  const visible = useSelector((state) => state.app.view.visible)
  const Panel = $derived(views[$selected].component)
</script>

<div id='view' class="flex-1 overflow-auto">
  {#if $visible}<Panel />{/if}
</div>
