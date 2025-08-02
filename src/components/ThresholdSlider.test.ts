import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

import { ThresholdSlider } from './'

describe('ThresholdSlider', () => {
  it('renders with correct label and initial value', () => {
    const props = {
      id: 'test-slider',
      label: 'Test Threshold',
      value: 50,
      onchange: vi.fn(),
    }

    render(ThresholdSlider, { props })

    expect(screen.getByLabelText('Test Threshold')).toBeInTheDocument()
    expect(screen.getByRole('slider')).toHaveValue('50')
    expect(screen.getByRole('spinbutton')).toHaveValue(50)
  })

  it('calls onchange when range input value changes', async () => {
    const onchange = vi.fn()
    const props = {
      id: 'test-slider',
      label: 'Test Threshold',
      value: 30,
      onchange,
    }

    render(ThresholdSlider, { props })

    const rangeInput = screen.getByRole('slider')
    await fireEvent.change(rangeInput, { target: { value: '75' } })

    expect(onchange).toHaveBeenCalled()
  })

  it('calls onchange when number input value changes', async () => {
    const onchange = vi.fn()
    const props = {
      id: 'test-slider',
      label: 'Test Threshold',
      value: 30,
      onchange,
    }

    render(ThresholdSlider, { props })

    const numberInput = screen.getByRole('spinbutton')
    await fireEvent.change(numberInput, { target: { value: '85' } })

    expect(onchange).toHaveBeenCalled()
  })

  it('has correct min, max, and step attributes', () => {
    const props = {
      id: 'test-slider',
      label: 'Test Threshold',
      value: 50,
      onchange: vi.fn(),
    }

    render(ThresholdSlider, { props })

    const rangeInput = screen.getByRole('slider')
    const numberInput = screen.getByRole('spinbutton')

    expect(rangeInput).toHaveAttribute('min', '0')
    expect(rangeInput).toHaveAttribute('max', '100')
    expect(rangeInput).toHaveAttribute('step', '1')

    expect(numberInput).toHaveAttribute('min', '0')
    expect(numberInput).toHaveAttribute('max', '100')
    expect(numberInput).toHaveAttribute('step', '1')
  })

  it('synchronizes values between range and number inputs', async () => {
    const props = {
      id: 'test-slider',
      label: 'Test Threshold',
      value: 25,
      onchange: vi.fn(),
    }

    render(ThresholdSlider, { props })

    const rangeInput = screen.getByRole('slider')
    const numberInput = screen.getByRole('spinbutton')

    expect(rangeInput).toHaveValue('25')
    expect(numberInput).toHaveValue(25)
  })

  it('renders with default value of 0 when not provided', () => {
    const props = {
      id: 'test-slider',
      label: 'Test Threshold',
      value: 0,
      onchange: vi.fn(),
    }

    render(ThresholdSlider, { props })

    expect(screen.getByRole('slider')).toHaveValue('0')
    expect(screen.getByRole('spinbutton')).toHaveValue(0)
  })

  it('applies correct CSS classes', () => {
    const props = {
      id: 'test-slider',
      label: 'Test Threshold',
      value: 50,
      onchange: vi.fn(),
    }

    render(ThresholdSlider, { props })

    const rangeInput = screen.getByRole('slider')
    const numberInput = screen.getByRole('spinbutton')

    expect(rangeInput).toHaveClass('range', 'range-accent', 'flex-1', 'h-4', 'pr-3')
    expect(numberInput).toHaveClass('input', 'input-bordered', 'w-20', 'text-right')
  })

  it('handles boundary values correctly', () => {
    const props = {
      id: 'test-slider',
      label: 'Test Threshold',
      value: 0,
      onchange: vi.fn(),
    }

    render(ThresholdSlider, { props })

    const rangeInput = screen.getByRole('slider')
    const numberInput = screen.getByRole('spinbutton')

    expect(rangeInput).toHaveValue('0')
    expect(numberInput).toHaveValue(0)
  })

  it('handles maximum boundary value correctly', () => {
    const props = {
      id: 'test-slider',
      label: 'Test Threshold',
      value: 100,
      onchange: vi.fn(),
    }

    render(ThresholdSlider, { props })

    const rangeInput = screen.getByRole('slider')
    const numberInput = screen.getByRole('spinbutton')

    expect(rangeInput).toHaveValue('100')
    expect(numberInput).toHaveValue(100)
  })
})
