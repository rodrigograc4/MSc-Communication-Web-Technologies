/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Garante que Tailwind veja todos os arquivos na pasta src
  ],
  theme: {
    extend: {
      colors: {
        //index
        'react-green': '#0c746c',
        'react-yellow': '#e9ba75',
        //ex1
        'darkest-red': '#400000',
        'clean-orange': '#ab644b',
        'off-white': '#f2f2eb',
        //ex2
        'dark-blue': '#00002a',
        'clean-blue': '#50949c',
        'off-blue-white': '#f0f5f5',
        //ex3
        'strong-magenta': '#e80464',
        'magenta': '#f0648c',
        'nice-pink': '#f89cb4',
        'dark-pink': '#601a2f',
      },
    },
  },
  plugins: [],
}

