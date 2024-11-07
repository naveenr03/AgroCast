/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#4caf50', // Green
        secondary: '#8bc34a', // Light green
        accent: '#ffeb3b', // Yellow
        background: '#f5f5dc', // Beige
        text: '#3e2723', // Dark brown
      },
      fontFamily: {
        sans: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

