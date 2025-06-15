/// <reference types="vitest/globals" />
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest'; //Register jest-dom matchers for Vitest
import CameraView from '../views/CameraView.svelte';

beforeAll(() => {
  Object.defineProperty(global.navigator, 'mediaDevices', {
    writable: true,
    value: {
      getUserMedia: vi.fn().mockResolvedValue({
        getTracks: () => [{ stop: vi.fn() }],
      }),
    },
  });
});

describe('CameraView Component', () => {
  // This test ensures the video element is rendered correctly
  it('should render the video element for the camera feed', () => {
    const { container } = render(CameraView);

    const video = container.querySelector('video');

    // Check that the <video> tag is present in the DOM
    expect(video).toBeInTheDocument();

    // Ensure it has autoplay and playsinline attributes
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('playsinline');
  });
});