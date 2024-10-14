import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Raleway', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        100: '0 1px 4px 0 rgba(0, 0, 0, 0.1)',
      },
      colors: {
        main: {
          100: '#282a30',
          200: '#e200ed',
          300: '#5B13CF',
          400: '#00EEFF',
          500: '#FFFFFF',
          600: '#4B5563',
          700: '#0D061C',
          800: '#211C58',
          900: '#140F2B',
          1000: '#5B13CF',
          1100: '#A44399',
          1200: '#372C48',
          1300: '#82489C',
          1400: '#0a3d51',
        },
        error: {
          100: '#CF1364',
        },
        opacity: {
          100: '#ffffff0a',
          200: '#000000aa',
          300: '#151330cf',
          400: '#1513308f',
          500: '#00000000',
        },
      },
    },
  },
  plugins: [],
};
export default config;
