import { describe, it, expect, vi } from 'vitest'
import { render, waitFor } from '@testing-library/svelte'
import { PathView } from './'

// Mock all @tauri-apps/api/path functions to resolve to fake paths
vi.mock('@tauri-apps/api/path', () => ({
  appCacheDir:     vi.fn().mockResolvedValue('/mock/appCacheDir'),
  appConfigDir:    vi.fn().mockResolvedValue('/mock/appConfigDir'),
  appDataDir:      vi.fn().mockResolvedValue('/mock/appDataDir'),
  appLocalDataDir: vi.fn().mockResolvedValue('/mock/appLocalDataDir'),
  appLogDir:       vi.fn().mockResolvedValue('/mock/appLogDir'),
  audioDir:        vi.fn().mockResolvedValue('/mock/audioDir'),
  cacheDir:        vi.fn().mockResolvedValue('/mock/cacheDir'),
  configDir:       vi.fn().mockResolvedValue('/mock/configDir'),
  dataDir:         vi.fn().mockResolvedValue('/mock/dataDir'),
  desktopDir:      vi.fn().mockResolvedValue('/mock/desktopDir'),
  documentDir:     vi.fn().mockResolvedValue('/mock/documentDir'),
  downloadDir:     vi.fn().mockResolvedValue('/mock/downloadDir'),
  executableDir:   vi.fn().mockResolvedValue('/mock/executableDir'),
  fontDir:         vi.fn().mockResolvedValue('/mock/fontDir'),
  homeDir:         vi.fn().mockResolvedValue('/mock/homeDir'),
  localDataDir:    vi.fn().mockResolvedValue('/mock/localDataDir'),
  pictureDir:      vi.fn().mockResolvedValue('/mock/pictureDir'),
  publicDir:       vi.fn().mockResolvedValue('/mock/publicDir'),
  resourceDir:     vi.fn().mockResolvedValue('/mock/resourceDir'),
  runtimeDir:      vi.fn().mockResolvedValue('/mock/runtimeDir'),
  tempDir:         vi.fn().mockResolvedValue('/mock/tempDir'),
  templateDir:     vi.fn().mockResolvedValue('/mock/templateDir'),
  videoDir:        vi.fn().mockResolvedValue('/mock/videoDir'),
}))

describe('PathView', () => {
  it('renders all Tauri base directory paths', async () => {
    const { getByText } = render(PathView)
    await waitFor(() => {
      expect(getByText('appCacheDirPath')).not.toBeNull()
      expect(getByText('/mock/appCacheDir')).not.toBeNull()
      expect(getByText('videoDirPath')).not.toBeNull()
      expect(getByText('/mock/videoDir')).not.toBeNull()
    })
  })
})
