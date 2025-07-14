<script lang='ts'>
  import { Button } from '../components'
  import { openUrl } from '@tauri-apps/plugin-opener'
  import { arch, locale, platform, type, version } from '@tauri-apps/plugin-os'
  import { open, message } from '@tauri-apps/plugin-dialog'
  import { invoke } from '@tauri-apps/api/core'
  import { type Detection } from '../store/appSlice'

  import { useDispatch } from '../store'
  const dispatch = useDispatch()

  const title = ''
  const openGoogle = async () => { await openUrl('https://www.google.com') }

  let popoverMenu: HTMLUListElement | null = null

  function handleSelect(action: () => void) {
    action()
    popoverMenu?.hidePopover()
  }

  const getOS = async () => {
    const info = `Platform: ${platform()}\nVersion: ${version()}\nType: ${type()}\nArch: ${arch()}\nLocale: ${await locale()}`
    await message(info, { title: 'Classific-Cam OS Information', kind:'info' })
    console.log(info)
  }

  const usls = async () => {
    const info = await invoke('infer') as Detection[]
    const fullMessage = info.map((item: Detection, index: number) =>
      `#${index + 1}
      Class: ${item.class}
      Score: ${item.score.toFixed(2)}
      BBox: [${item.bbox.join(', ')}]`,
    ).join('\n\n')

    await message(fullMessage, { title: 'Classific-Cam OS Information', kind: 'info' })
  }

  const openFolder = async () => {
    const file = await open({ multiple: false, directory: false })
    await message(`You selected: ${file}`, { title: 'Classifi-Cam', kind:'info' })
  }

  const viewPath = () => dispatch({ type: 'app/viewPath' })

  const btnClass = 'btn-ghost border-none shadow-none transition-colors py-2 h-full px-1'
</script>

<div id='titlebar' class='border-b flex items-center h-12 select-none overflow-hidden drag'>
  <div class='flex items-center h-full min-w-min nodrag order-0'>
    <Button name='classificam' btnClass={btnClass} onClick={() => openGoogle()} labelRight>Classifi-Cam</Button>
  </div>
  <div class='flex items-center justify-center mx-2 h-full max-w-max min-w-0 order-1'>
    <div class='block flex-shrink truncate selected'>{title}</div>
  </div>
  <div class='flex flex-1 justify-end items-center h-full min-w-min nodrag order-2 space-x-1'>
    <Button name='viewHome'     btnClass={btnClass}/>
    <Button name='themeLight'   btnClass={btnClass}/>
    <Button name='themeDark'    btnClass={btnClass}/>
    <Button name='viewSettings' btnClass={btnClass}/>
    <Button name='showMenu'     btnClass={btnClass}  popovertarget="popover-menu" onClick={() => null }/>
    <ul class="dropdown menu w-52 rounded-box bg-base-100 shadow-sm" popover id="popover-menu" bind:this={popoverMenu}>
      <li><Button name='viewPath'   btnClass={btnClass} labelRight onClick={() => handleSelect(viewPath)}>View Paths</Button></li>
      <li><Button name='getOS'      btnClass={btnClass} labelRight onClick={() => handleSelect(getOS)}>OS Values</Button></li>
      <li><Button name='plane'      btnClass={btnClass} labelRight onClick={() => handleSelect(usls)}>Model Shape</Button></li>
      <li><Button name='openFolder' btnClass={btnClass} labelRight onClick={() => handleSelect(openFolder)}>Open Model</Button></li>
    </ul>
  </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  #titlebar :global(.icon) { @apply h-10; }
</style>
