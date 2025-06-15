/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
import LibraryView from '../views/LibraryView.svelte';

// Mocking Tauri FS plugin methods to simulate reading images from the app's local directory
vi.mock('@tauri-apps/plugin-fs', async () => {
  return {
    readDir: vi.fn().mockResolvedValue([
      { name: 'example.jpg' },
      { name: 'test.png' },
    ]),
    readFile: vi.fn().mockResolvedValue(new Uint8Array([137, 80, 78, 71])), // Simulate binary file data
    BaseDirectory: { Resource: 'resource' },
  };
});

describe('LibraryView Component', () => {
  // This test checks that the LibraryView component:
  // - Calls the Tauri readDir and readFile APIs to retrieve image files from the local directory
  // - Properly converts and renders the images using <img> tags
  // - Displays the filename below each corresponding image
  it('should load image filenames and render their previews', async () => {
    const { getByAltText, getByText } = render(LibraryView);

    // Wait for images to be processed and rendered after onMount
    await waitFor(() => {
      expect(getByAltText('example.jpg')).toBeInTheDocument();
      expect(getByText('example.jpg')).toBeInTheDocument();

      expect(getByAltText('test.png')).toBeInTheDocument();
      expect(getByText('test.png')).toBeInTheDocument();
    });
  });
});