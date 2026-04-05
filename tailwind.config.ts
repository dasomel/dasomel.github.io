import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0',
          300: '#86efac', 400: '#4ade80', 500: '#22c55e',
          600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d',
        },
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      fontSize: {
        xs:   ['0.75rem',  { lineHeight: '1.5' }],
        sm:   ['0.875rem', { lineHeight: '1.6' }],
        base: ['1rem',     { lineHeight: '1.7' }],
        lg:   ['1.125rem', { lineHeight: '1.7' }],
        xl:   ['1.25rem',  { lineHeight: '1.6' }],
        '2xl':['1.5rem',   { lineHeight: '1.4' }],
        '3xl':['1.875rem', { lineHeight: '1.3' }],
        '4xl':['2.25rem',  { lineHeight: '1.2' }],
        '5xl':['3rem',     { lineHeight: '1.1' }],
        '6xl':['3.75rem',  { lineHeight: '1.08' }],
        '7xl':['4.5rem',   { lineHeight: '1.05' }],
      },
    },
  },
  plugins: [typography],
};
export default config;
