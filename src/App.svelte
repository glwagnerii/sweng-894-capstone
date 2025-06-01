<script lang="ts">
  import { useSelector, useDispatch } from './store'
  import { TitleBar, ActivityBar, LeftPanel, BottomPanel, RightPanel, StatusBar } from './layouts'
  import { Counter } from './components'
  import { PluginHTTP, PluginStore } from './plugins'

  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'

  const count = writable(0)
  setContext('count', count)

  const dispatch = useDispatch()
  const theme = useSelector((state) => state.app.theme)
  const handleResize = () => { dispatch({ type: 'app/windowResize' }) }
  const handleKeydown = (e: KeyboardEvent) => { console.log(e.key) }
</script>

<svelte:window on:resize={handleResize} onkeydown={handleKeydown}/>

<div id='classicam' class="h-screen w-screen {$theme.isDark ? 'dark' : ''}" data-theme={$theme.name}>
    <TitleBar />
    <div class='absolute top-8 left-0 h-[var(--h-layout)] w-screen'>
        <div class = 'relative'>
          <ActivityBar />
          <LeftPanel />
          <div class='body absolute top-0 left-[calc(48px+var(--w-panel-left))] h-[var(--h-layout)] w-[var(--w-body)]'>
            <div class = 'relative block overflow-hidden h-full w-full'>
              <div id='main-body' class='absolute top-0 left-0 h-[var(--h-body)] w-[var(--w-body)] overflow-auto'>
                <!-- <Body /> -->
                <PluginHTTP />
                <PluginStore />
                <p></p>
                <Counter />
              </div>
              <BottomPanel />
            </div>
          </div>
          <RightPanel />
        </div>
    </div>
    <StatusBar />
</div>
