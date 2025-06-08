<script lang='ts'>
  import type { ChangeEventHandler } from 'svelte/elements'
  import { useSelector, useDispatch } from '../store'
  import { Button } from '../components'
  import { ZOOM_MIN, ZOOM_MAX } from '../constants'

  const dispatch = useDispatch()
  const zoom = useSelector((state) => state.app.zoom)

  const onchange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e && e.currentTarget) {
      dispatch({ type: 'app/zoomSlide', payload: e.currentTarget.value })
    }
  }
</script>

<div id='statusbar' class='border-t flex justify-between items-center absolute top-[calc(100vh-32px)] left-0 h-8 w-screen px-6 select-none text-sm'>
    <div class='statusbar-left flex justify-start items-center h-full'>
      left
    </div>
    <div class='statusbar-right flex flex-row justify-end items-center h-full'>
      <Button name='zoomDecrease'/>
      <input class='range appearance-none h-0.5 w-16' type='range' min={ZOOM_MIN} max={ZOOM_MAX} value={$zoom.level} onchange={onchange} />
      <Button name='zoomIncrease'/>
      <Button name='zoomReset' btnClass='w-14'>{$zoom.level}%</Button>
      <Button name='zoomFit'/>
    </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  #statusbar :global(.btn) { @apply h-full px-2; }
</style>
