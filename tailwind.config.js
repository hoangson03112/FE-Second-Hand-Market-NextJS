/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"SF Pro Text"',
        '"SF Pro Display"',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ],
    },
    extend: {
      keyframes: {
        fazer1: {
          '0%': { left: '0', opacity: '1' },
          '100%': { left: '-80px', opacity: '0' },
        },
        fazer2: {
          '0%': { left: '0', opacity: '1' },
          '100%': { left: '-100px', opacity: '0' },
        },
        fazer3: {
          '0%': { left: '0', opacity: '1' },
          '100%': { left: '-50px', opacity: '0' },
        },
        fazer4: {
          '0%': { left: '0', opacity: '1' },
          '100%': { left: '-150px', opacity: '0' },
        },
        speeder: {
          '0%': { transform: 'translate(2px, 1px) rotate(0deg)' },
          '10%': { transform: 'translate(-1px, -3px) rotate(-1deg)' },
          '20%': { transform: 'translate(-2px, 0px) rotate(1deg)' },
          '30%': { transform: 'translate(1px, 2px) rotate(0deg)' },
          '40%': { transform: 'translate(1px, -1px) rotate(1deg)' },
          '50%': { transform: 'translate(-1px, 3px) rotate(-1deg)' },
          '60%': { transform: 'translate(-1px, 1px) rotate(0deg)' },
          '70%': { transform: 'translate(3px, 1px) rotate(-1deg)' },
          '80%': { transform: 'translate(-2px, -1px) rotate(1deg)' },
          '90%': { transform: 'translate(2px, 1px) rotate(0deg)' },
          '100%': { transform: 'translate(1px, -2px) rotate(-1deg)' },
        },
        lf: {
          '0%': { left: '200%', opacity: '1' },
          '100%': { left: '-200%', opacity: '0' },
        },
        lf2: {
          '0%': { left: '200%', opacity: '1' },
          '100%': { left: '-200%', opacity: '0' },
        },
        lf3: {
          '0%': { left: '200%', opacity: '1' },
          '100%': { left: '-100%', opacity: '0' },
        },
        lf4: {
          '0%': { left: '200%', opacity: '1' },
          '100%': { left: '-100%', opacity: '0' },
        },
      },
      animation: {
        fazer1: 'fazer1 0.2s linear infinite',
        fazer2: 'fazer2 0.4s linear infinite',
        fazer3: 'fazer3 0.4s linear infinite',
        fazer4: 'fazer4 1s linear infinite',
        speeder: 'speeder 0.4s linear infinite',
        lf: 'lf 0.6s linear infinite',
        lf2: 'lf2 0.8s linear infinite',
        lf3: 'lf3 0.6s linear infinite',
        lf4: 'lf4 0.5s linear infinite',
      },
    },
  },
  plugins: [],
};
