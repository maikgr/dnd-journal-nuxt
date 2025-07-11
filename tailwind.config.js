/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        nier: {
          // Main colors
          primary: '#454138',    // Dark brown
          secondary: '#bab5a1',  // Light brown
          warning: '#CD664D', // red-orange
          
          // Semantic colors
          'text-primary': '#454138',
          'text-inverse': '#bab5a1',
          'bg-primary': '#d1cdb7',
          'bg-secondary': '#bab5a1',
          'border': '#454138',
          'grid': '#ccc8b1',
          
          // State variations
          'hover': '#3c392f',
          'active': '#524f45',
          'disabled': '#a09c8d',
        }
      },
      fontFamily: {
        'nier': ['Rajdhani', 'sans-serif'],           // UI/Headers (existing)
        'mono': ['Share Tech Mono', 'monospace'],      // Code/Data (existing)
        'content': ['Inter', 'sans-serif'],           // Paragraphs
      },
      boxShadow: {
        'nier': '3px 3px 0px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
} 