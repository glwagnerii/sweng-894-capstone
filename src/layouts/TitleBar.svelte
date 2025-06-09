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

<div id='titlebar' class='border-b flex items-center h-12 select-none overflow-hidden drag'>
  <div class='flex items-center h-full min-w-min nodrag order-0'>
    <Button name='classificam' onClick={() => openGoogle()} labelRight>Classifi-Cam</Button>
  </div>
  <div class='flex items-center justify-center mx-2 h-full max-w-max min-w-0 order-1'>
    <div class='block flex-shrink truncate selected'>{title}</div>
  </div>
  <div class='flex flex-1 justify-end items-center h-full min-w-min nodrag order-2 space-x-1'>
    <Button name='themeLight'/>
    <Button name='themeDark'/>
    <Button name='viewPath'/>
    <Button name='getOS' onClick={() => getOS()}/>
    <Button name='viewHome'/>
  </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  #titlebar :global(.btn)  { @apply py-2 h-full px-1; }
  #titlebar :global(.icon) { @apply h-10; }
</style>
