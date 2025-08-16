/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}", // Sucht in all deinen Komponenten
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}