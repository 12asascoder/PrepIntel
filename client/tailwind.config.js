/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 50: '#e7eaf0', 100: '#c3c9d6', 200: '#9ba5ba', 300: '#73819e', 400: '#556689', 500: '#374b74', 600: '#31446c', 700: '#293b61', 800: '#223357', 900: '#162344', DEFAULT: '#0f1a2e' },
        teal: { 50: '#e6faf4', 400: '#2dd4a8', 500: '#10b981', 600: '#059669', 700: '#047857', DEFAULT: '#10b981' },
        slate: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a' },
        canvas: '#f1f5f9',
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981'
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        glow: { '0%': { boxShadow: '0 0 5px rgba(16,185,129,0.2)' }, '100%': { boxShadow: '0 0 20px rgba(16,185,129,0.4)' } }
      }
    },
  },
  plugins: [],
}
