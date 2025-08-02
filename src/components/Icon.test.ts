import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'

import { Icon }  from './'
import { icons } from '../constants'

describe('Icon', () => {
  it('renders a solid icon with correct attributes', () => {
    render(Icon, { props: { name: 'psu' } })

    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('icon', 'icon-psu')
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg')
    expect(svg).toHaveAttribute('viewBox', icons['psu'].viewbox)
    expect(svg).toHaveAttribute('fill', 'currentColor')
    expect(svg).not.toHaveAttribute('stroke')
    expect(svg).not.toHaveAttribute('stroke-width')
    expect(svg).not.toHaveAttribute('stroke-dasharray')
  })

  it('applies custom iconClass to svg element', () => {
    render(Icon, { props: { name: 'psu', iconClass: 'custom-class another-class' } })

    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('icon', 'icon-psu', 'custom-class', 'another-class')
  })
})
