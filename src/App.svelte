<script lang="ts">
  import { onMount } from 'svelte'
  import { useSelector, useDispatch } from './store'
  import { getFavorites, getRecents, getModels, getModel, getExpire } from './store/appSlice'
  import { StatusBar, TitleBar, ViewContainer } from './layouts'

  import clsx from 'clsx'

  let loading = $state(true)
  const dispatch = useDispatch()
  const isDark = useSelector((state) => state.app.theme.isDark)

  const classes = $derived(clsx('flex flex-col h-dvh w-dvw overflow-hidden', $isDark ? 'dark' : ''))

  const handleResize = () => { dispatch({ type: 'app/windowResize' }) }
  const handleKeydown = (e: KeyboardEvent) => { console.log(e.key) }

  onMount(async () => {
    await Promise.all([
      dispatch(getFavorites()),
      dispatch(getRecents()),
      dispatch(getModels()),
      dispatch(getModel()),
      dispatch(getExpire()),
    ])
    loading = false
  })

</script>

<svelte:window on:resize={handleResize} on:keydown={handleKeydown}/>
{#if loading}
  <div>Loading...</div>
{:else}
  <div id="classicam" class={classes} data-theme={$isDark ? 'dark-cc' : 'light-cc'}>
    <TitleBar />
    <ViewContainer />
    <StatusBar />
  </div>
{/if}
