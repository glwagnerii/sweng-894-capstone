/// <reference types="vitest/globals" />
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import ResultView from '../views/ResultView.svelte'

describe('ResultView Component', () => {
  // This test ensures the image and classification results render as expected
  it('should display the image preview and classification tags', () => {
    const mockImageSrc = 'test-image.png'
    const mockClassifications = ['Onion', 'Garlic', 'Tomato']

    const { getByAltText, getByText } = render(ResultView, {
      props: {
        imageSrc: mockImageSrc,
        classifications: mockClassifications,
      },
    })

    // Validate the image preview
    const image = getByAltText('Classified Item')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockImageSrc)

    // Validate classification tags
    mockClassifications.forEach((item) => {
      expect(getByText(item)).toBeInTheDocument()
    })
  })
})
