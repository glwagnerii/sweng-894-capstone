<script lang='ts'>
  import { Button } from '../components'
  import { openUrl } from '@tauri-apps/plugin-opener'
  import { arch, locale, platform, type, version } from '@tauri-apps/plugin-os'
  import { message } from '@tauri-apps/plugin-dialog'

  const title = ''
  const openGoogle = async () => { await openUrl('https://www.google.com') }

  const getOS = async () => {
    const info = `Platform: ${platform()}\nVersion: ${version()}\nType: ${type()}\nArch: ${arch()}\nLocale: ${await locale()}`
    await message(info, { title: 'Classific-Cam OS Information', kind:'info' })
    console.log(info)
  }
</script>

<div id='titlebar' class='border-b flex justify-between items-center h-14 w-full select-none text-xl whitespace-normal overflow-hidden drag'>
  <div class='titlebar-left flex justify-start items-center h-full min-w-min nodrag order-0'>
    <div class='title-bar-logo flex justify-start items-center h-full px-2'>
      <Button name='classificam' iconClass='h-10' onClick={() => openGoogle()}/>
      <div class='app-name px-2'>Classifi-Cam</div>
    </div>
  </div>
  <div class='titlebar-center flex items-center justify-center my-0 mx-2 h-full max-w-max min-w-0 order-1'>
    <div class='window-title block basis-auto flex-shrink flex-grow-0 mx-0 truncate selected'>{title}</div>
  </div>
  <div class='titlebar-right flex justify-end items-center h-full min-w-min nodrag order-2 px-2 space-x-2'>
    <Button name='themeLight' iconClass='h-10'/>
    <Button name='themeDark'  iconClass='h-10'/>
    <Button name='viewPath'   iconClass='h-10'/>
    <Button name='getOS'      iconClass='h-10' onClick={() => getOS()}/>
    <Button name='viewHome'   iconClass='h-10'/>
  </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  #titlebar :global(.btn) { @apply h-full px-2; }
  #titlebar :global(.icon-psu) { @apply w-8 text-blue-800 bg-white; }
</style>
