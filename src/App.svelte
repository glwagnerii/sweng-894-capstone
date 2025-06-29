<script lang="ts">
  import { useSelector, useDispatch } from './store'
  import { StatusBar, TitleBar, ViewContainer } from './layouts'

  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import clsx from 'clsx'

  const count = writable(0)
  setContext('count', count)

  const dispatch = useDispatch()
  const isDark = useSelector((state) => state.app.theme.isDark)
  const classes = $derived(clsx('flex flex-col h-dvh w-dvw overflow-hidden', $isDark ? 'dark' : ''))

  const handleResize = () => { dispatch({ type: 'app/windowResize' }) }
  const handleKeydown = (e: KeyboardEvent) => { console.log(e.key) }
</script>

<svelte:window on:resize={handleResize} onkeydown={handleKeydown}/>

<div id="classicam" class={classes} data-theme={$isDark ? 'dark-cc' : 'light-cc'}>
  <TitleBar />
  <ViewContainer />
  <StatusBar />
</div>
