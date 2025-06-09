<script lang='ts'>
  import { Button } from '../components'
  import { arch, locale, platform, type, version } from '@tauri-apps/plugin-os'
  import { open, message } from '@tauri-apps/plugin-dialog'

  const openFolder = async () => {
    const file = await open({ multiple: false, directory: false })
    await message(`You selected: ${file}`, { title: 'Tauri', kind:'info' })
  }

  const getOS = async () => {
    const info = `Platform: ${platform()}, Version: ${version()}, Type: ${type()}, Arch: ${arch()}, Locale: ${await locale()}`
    console.log(info)
  }
</script>

<div id='statusbar' class='border-t flex items-center h-18 w-full px-4 select-none text-base'>
  <div class="flex flex-1 flex-row justify-evenly items-center h-full space-x-2">
    <Button name='openHome'   iconClass='h-10' label="Home"/>
    <Button name='openCamera'   iconClass='h-10' label="Camera"/>
    <Button name='openImage'    iconClass='h-10' label="Image"/>
    <Button name='openFolder'   iconClass='h-10' label="Models"   onClick={() => openFolder()}/>
    <Button name='getOS'        iconClass='h-10' label="Info"   onClick={() => getOS()}/>
  </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  #statusbar :global(.btn) { @apply h-full px-2; }
</style>
