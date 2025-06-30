/// <reference types="vitest/globals" />

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import { HomeView } from '../views'
import '@testing-library/jest-dom'

describe('HomeView Component', () => {
  it('should render the logo and recent activity section', () => {
    const { getByAltText, getByText } = render(HomeView)

    // Check logo image
    expect(getByAltText('ClassifiCam Logo')).toBeInTheDocument()

    // Check recent activity section
    expect(getByText('Recent Activity')).toBeInTheDocument()

    // Check "See more" button
    expect(getByText('See more')).toBeInTheDocument()
  })
})
