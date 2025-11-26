/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'os-bg': '#000000',
        'os-text': '#ffffff',
        'os-text-muted': '#a1a1aa',
        'os-accent': '#0a84ff',
        'os-danger': '#ff453a',
        'os-success': '#32d74b',
        'os-warning': '#ffd60a',
      },
      animation: {
        'pulse-slow': 'pulse 2s infinite',
      },
    },
  },
  plugins: [],
}
