import daisyui from 'daisyui'

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
        cc: {
          red:                '#D70010',
          black:              '#1E1D1C',
          white:              '#FFFFFF',
          grey:               '#63666A',
          lightgrey:          '#B0B2B4',
          blue:               '#003158',
          lightblue:          '#3684C0',
          green:              '#004B4B',
          lightgreen:         '#00847E',
          orange:             '#E66300',
          yellow:             '#FFAB18',
        },
      },
    },
  },
  plugins: [daisyui],
  // plugins: [require('@tailwindcss/typography')],
}
