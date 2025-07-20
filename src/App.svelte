<script lang="ts">
  import { onMount } from 'svelte'
  import { useSelector, useDispatch } from './store'
  import { getFavorites, getModels, getModel } from './store/appSlice'
  import { StatusBar, TitleBar, ViewContainer } from './layouts'

  import clsx from 'clsx'

  const dispatch = useDispatch()
  const isDark = useSelector((state) => state.app.theme.isDark)

  const classes = $derived(clsx('flex flex-col h-dvh w-dvw overflow-hidden', $isDark ? 'dark' : ''))

  const handleResize = () => { dispatch({ type: 'app/windowResize' }) }
  const handleKeydown = (e: KeyboardEvent) => { console.log(e.key) }

  onMount(() => {
    dispatch(getFavorites())
    dispatch(getModels())
    dispatch(getModel())
  })

</script>

<svelte:window on:resize={handleResize} onkeydown={handleKeydown}/>

<div id="classicam" class={classes} data-theme={$isDark ? 'dark-cc' : 'light-cc'}>
  <TitleBar />
  <ViewContainer />
  <StatusBar />
</div>
