/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          pink:  '#FF2D78',
          blue:  '#0066FF',
          volt:  '#CCFF00',
          black: '#0A0A0A',
        },
        light: {
          bg:      '#FFFFFF',
          surface: '#F8FAFC',
          border:  '#E0E0E0',
          text:    '#0A0A0A',
          muted:   '#718096',
        },
        dark: {
          bg:      '#0A0F1E',
          surface: '#111827',
          border:  '#1F2937',
          text:    '#F9FAFB',
          muted:   '#9CA3AF',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      borderRadius: {
        card:  '12px',
        modal: '16px',
      },
      boxShadow: {
        card:      '0 1px 4px rgba(0,0,0,0.06)',
        'card-dark': '0 1px 4px rgba(0,0,0,0.3)',
        hover:     '0 8px 24px rgba(0,0,0,0.12)',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
}
