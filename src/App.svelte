<script lang="ts">
  import { useSelector, useDispatch } from './store'
  import { StatusBar, TitleBar, ViewContainer } from './layouts'

  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  // import Colors from './components/Colors.svelte'

  const count = writable(0)
  setContext('count', count)

  const dispatch = useDispatch()
  const isDark = useSelector((state) => state.app.theme.isDark)

  const handleResize = () => { dispatch({ type: 'app/windowResize' }) }
  const handleKeydown = (e: KeyboardEvent) => { console.log(e.key) }
</script>

<svelte:window on:resize={handleResize} onkeydown={handleKeydown}/>

<div id="classicam" class="flex flex-col h-dvh w-dvw overflow-hidden bg-[#fdf3e6]" data-theme={$isDark ? 'dark' : 'light'}>
  <TitleBar />
  <ViewContainer />
  <StatusBar />
</div>
