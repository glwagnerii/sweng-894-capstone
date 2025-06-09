<script lang="ts">
  import { onMount } from 'svelte'
  import { appCacheDir, appConfigDir, appDataDir, appLocalDataDir, appLogDir, audioDir, cacheDir,
    configDir, dataDir, desktopDir, documentDir, downloadDir, executableDir, fontDir, homeDir, localDataDir,
    pictureDir, publicDir, resourceDir, runtimeDir, tempDir, templateDir, videoDir } from '@tauri-apps/api/path'

  type PathEntry = { fn: () => Promise<string>, value: string }

  let paths: Record<string, PathEntry> = {
    appCacheDirPath:    { fn: appCacheDir,     value: '' },
    appConfigDirPath:   { fn: appConfigDir,    value: '' },
    appDataDirPath:     { fn: appDataDir,      value: '' },
    appLocalDataDirPath:{ fn: appLocalDataDir, value: '' },
    appLogDirPath:      { fn: appLogDir,       value: '' },
    audioDirPath:       { fn: audioDir,        value: '' },
    cacheDirPath:       { fn: cacheDir,        value: '' },
    configDirPath:      { fn: configDir,       value: '' },
    dataDirPath:        { fn: dataDir,         value: '' },
    desktopPath:        { fn: desktopDir,      value: '' },
    documentDirPath:    { fn: documentDir,     value: '' },
    downloadDirPath:    { fn: downloadDir,     value: '' },
    executableDirPath:  { fn: executableDir,   value: '' },
    fontDirPath:        { fn: fontDir,         value: '' },
    homeDirPath:        { fn: homeDir,         value: '' },
    localDataDirPath:   { fn: localDataDir,    value: '' },
    pictureDirPath:     { fn: pictureDir,      value: '' },
    publicDirPath:      { fn: publicDir,       value: '' },
    resourceDirPath:    { fn: resourceDir,     value: '' },
    runtimeDirPath:     { fn: runtimeDir,      value: '' },
    temp:               { fn: tempDir,         value: '' },
    templateDirPath:    { fn: templateDir,     value: '' },
    videoDirPath:       { fn: videoDir,        value: '' },
  }

  onMount(async () => {
    for (const [, entry] of Object.entries(paths)) {
      try { entry.value = await entry.fn() }
      catch { entry.value = '[unavailable]' }
    }
    paths = { ...paths }
  })
</script>

<div class="mx-auto mt-8 p-6 bg-white shadow-md border border-gray-200">
  <h3 class="text-xl font-semibold mb-4 text-gray-800">Tauri BaseDirectory values:</h3>
  <ul class="divide-y divide-gray-200">
    {#each Object.entries(paths) as [name, entry] (name)}
      <li class="py-1 flex flex-col md:flex-row md:items-center">
        <span class="font-mono text-sm text-blue-700 w-56">{name}</span>
        <code class="break-all bg-gray-100 rounded px-2 py-1 text-gray-700 text-xs ml-0 md:ml-2 mt-1 md:mt-0">{entry.value}</code>
      </li>
    {/each}
  </ul>
</div>
