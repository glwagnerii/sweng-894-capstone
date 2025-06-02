/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,svelte,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-tb': { l: 'var(--color-light-titlebar)', d: 'var(--color-dark-titlebar)' },
        'bg-ab': { l: 'var(--color-light-activitybar)', d: 'var(--color-dark-activitybar)' },
        'bg-pnl': { l: 'var(--color-light-panel)', d: 'var(--color-dark-panel)' },
        'bg-bod': { l: 'var(--color-light-body)', d: 'var(--color-dark-body)' },
        'bg-sb': { l: 'var(--color-light-statusbar)', d: 'var(--color-dark-statusbar)' },
        'text-tb': { l: 'var(--color-light-titlebar-text)', d: 'var(--color-dark-titlebar-text)' },
        'text-ab': { l: 'rgb(var(--color-light-activitybar-text) / <alpha-value>)', d: 'rgb(var(--color-dark-activitybar-text) / <alpha-value>)' },
        'text-pnl': { l: 'var(--color-light-panel-text)', d: 'var(--color-dark-panel-text)' },
        'text-bod': { l: 'var(--color-light-body-text)', d: 'var(--color-dark-body-text)' },
        'text-sb': { l: 'var(--color-light-statusbar-text)', d: 'var(--color-dark-statusbar-text)' },
        'a-sb': { l: 'rgb(var(--color-light-accent-sb) / <alpha-value>)', d: 'rgb(var(--color-dark-accent-sb) / <alpha-value>)' },
        'a-tb': { l: 'rgb(var(--color-light-accent-tb) / <alpha-value>)', d: 'rgb(var(--color-dark-accent-tb) / <alpha-value>)' },
        'bc1': { l: 'var(--color-light-border)', d: 'var(--color-dark-border)' },
        'custom': {
          red: '#D70010',
          black: '#1E1D1C',
          white: '#FFFFFF',
          grey: '#63666A',
          lightgrey: '#B0B2B4',
          blue: '#003158',
          lightblue: '#3684C0',
          green: '#004B4B',
          lightgreen: '#00847E',
          orange: '#E66300',
          yellow: '#FFAB18',
        },
      },
    },
  },
  // plugins: [require('@tailwindcss/typography')],
}
