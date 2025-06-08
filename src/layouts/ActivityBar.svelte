<script lang='ts'>
  import { Button } from '../components'
  import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification'
  import { arch, locale, platform, type, version } from '@tauri-apps/plugin-os'
  import { open, message } from '@tauri-apps/plugin-dialog'

  const openFolder = async () => {
    const file = await open({ multiple: false, directory: false })
    await message(`You selected: ${file}`, { title: 'Tauri', kind:'info' })
  }

  const notify = async () => {
    let permissionGranted = await isPermissionGranted()
    if (!permissionGranted) {
      const permission = await requestPermission()
      permissionGranted = permission === 'granted'
    }
    if (permissionGranted) { sendNotification({ title: 'Tauri', body: 'Tauri is awesome!' }) }
  }

  const getOS = async () => {
    const info = `Platform: ${platform()}, Version: ${version()}, Type: ${type()}, Arch: ${arch()}, Locale: ${await locale()}`
    console.log(info)
  }

</script>

<div id='activitybar' class='border-r flex flex-col flex-none justify-between absolute top-0 left-0 h-[var(--h-layout)] w-12'>
  <div class='tb tb-abTop flex flex-col justify-center items-center'>
    <Button name='showLeft1'/>
    <Button name='showLeft2'/>
  </div>
  <div class='tb tb-abBottom flex flex-col justify-center items-center'>
    <Button name='themeLight'/>
    <Button name='themeDark'/>
    <Button name='openFolder' onClick={() => openFolder()}/>
    <Button name='notification' onClick={() => notify()}/>
    <Button name='getOS' onClick={() => getOS()}/>
  </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  #activitybar :global(.btn)  { @apply h-12 w-full p-0; }
  #activitybar :global(.icon) { @apply h-7 w-7; }
</style>
