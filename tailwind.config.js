import daisyui from 'daisyui'

export default {
  content: ['./index.html', './src/**/*.{js,ts,svelte}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: { extend: {} },
  plugins: [daisyui],
  daisyui: { themes: ['light', 'dark'] }
}