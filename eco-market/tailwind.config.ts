import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-medium': 'float-medium 6s ease-in-out infinite',
        'float-fast': 'float-fast 4s ease-in-out infinite',
        'gradient-shift': 'gradientShift 20s ease infinite',
      },
      keyframes: {
        fadeIn: {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'float-slow': {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)' 
          },
          '50%': { 
            transform: 'translateY(-20px) rotate(180deg)' 
          },
        },
        'float-medium': {
          '0%, 100%': { 
            transform: 'translateY(0px) translateX(0px)' 
          },
          '33%': { 
            transform: 'translateY(-15px) translateX(10px)' 
          },
          '66%': { 
            transform: 'translateY(-5px) translateX(-5px)' 
          },
        },
        'float-fast': {
          '0%, 100%': { 
            transform: 'translateY(0px) scale(1)' 
          },
          '25%': { 
            transform: 'translateY(-10px) scale(1.1)' 
          },
          '50%': { 
            transform: 'translateY(-20px) scale(0.9)' 
          },
          '75%': { 
            transform: 'translateY(-10px) scale(1.05)' 
          },
        },
        gradientShift: {
          '0%, 100%': {
            backgroundPosition: '0% 50%, 0% 0%, 0% 0%, 0% 0%',
          },
          '25%': {
            backgroundPosition: '25% 75%, 100% 100%, 25% 25%, 75% 75%',
          },
          '50%': {
            backgroundPosition: '100% 50%, 50% 50%, 100% 100%, 50% 50%',
          },
          '75%': {
            backgroundPosition: '75% 25%, 25% 25%, 75% 75%, 25% 25%',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },

} satisfies Config;






