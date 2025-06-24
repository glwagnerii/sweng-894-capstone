<script lang="ts">
  import { onMount } from 'svelte'
  import { useDispatch, useSelector } from './store'
  import { StatusBar, TitleBar, ViewContainer } from './layouts'
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { setThemeByTime } from './themes/themeSet'

  const count = writable(0)
  setContext('count', count)

  const dispatch = useDispatch()

  const handleResize = () => dispatch({ type: 'app/windowResize' })
  const handleKeydown = (e: KeyboardEvent) => console.log(e.key)

  // Detect theme on app load
  onMount(() => {
    setThemeByTime()
  })

  // Correctly use Svelte store (not window binding!)
  const isDarkStore = useSelector((state) => state.app.theme.isDark)
  let isDark = false
  isDarkStore.subscribe(value => isDark = value)

  $: theme = isDark ? 'dark' : 'light'
</script>

<svelte:window on:resize={handleResize} on:keydown={handleKeydown} />

<div id="classicam" data-theme={theme} class="flex flex-col h-dvh w-dvw overflow-hidden">
  <TitleBar />
  <ViewContainer />
  <StatusBar />
</div>

