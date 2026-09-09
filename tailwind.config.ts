import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          50: '#FAF6ED',
          100: '#F2E8D3',
          200: '#E6D3A9',
          300: '#D7BA7D',
          400: '#C8A355',
          500: '#C9A66B',
          600: '#A98442',
          700: '#83622E',
          800: '#614620',
          900: '#463217',
        },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        cinzel: ['var(--font-cinzel)', 'serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
        greatvibes: ['var(--font-greatvibes)', 'cursive'],
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
