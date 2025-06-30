<script lang='ts'>
  import { Button } from '../components'
  import { openUrl } from '@tauri-apps/plugin-opener'
  import { arch, locale, platform, type, version } from '@tauri-apps/plugin-os'
  import { message } from '@tauri-apps/plugin-dialog'
  import { invoke } from '@tauri-apps/api/core'

  const title = ''
  const openGoogle = async () => { await openUrl('https://www.google.com') }

  const getOS = async () => {
    const info = `Platform: ${platform()}\nVersion: ${version()}\nType: ${type()}\nArch: ${arch()}\nLocale: ${await locale()}`
    await message(info, { title: 'Classific-Cam OS Information', kind:'info' })
    console.log(info)
  }

//  const usls = async () => {
//    const info = await invoke('infer_frame', { base64: 'gerry' }) as Array<{ class: string, score: number, bbox: [number, number, number, number] }>

//    // Build a multiline string of all results
//    const fullMessage = info.map((item, index) =>
//      `#${index + 1}
//       Class: ${item.class}
//       Score: ${item.score.toFixed(2)}
//       BBox: [${item.bbox.join(', ')}]`,
//    ).join('\n\n')

//    await message(fullMessage, { title: 'Classific-Cam OS Information', kind: 'info' })

//    console.log(info)
//  }

  const usls = async () => {
    const info = await invoke('doit') as string
    await message(info, { title: 'Classific-Cam OS Information', kind:'info' })
  }

  async function greet() {
    const info = await invoke('greet', { name: 'gerry' }) as string
    await message(info, { title: 'Classific-Cam OS Information', kind:'info' })
  }

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
    <Button name='showMenu'   btnClass={btnClass} iconClass='h-10' onClick={() => greet()}/>
    <Button name='themeLight' btnClass={btnClass}/>
    <Button name='themeDark'  btnClass={btnClass}/>
    <Button name='viewPath'   btnClass={btnClass}/>
    <Button name='getOS'      btnClass={btnClass} onClick={() => getOS()}/>
    <Button name='viewHome'   btnClass={btnClass}/>
    <Button name='plane'      btnClass={btnClass} onClick={() => usls()}/>
  </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  #titlebar :global(.icon) { @apply h-10; }
</style>
