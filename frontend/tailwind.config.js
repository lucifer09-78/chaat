/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#2b6cee",
                "primary-light": "#5a95ff",
                "primary-dark": "#1a4bb0",
                "background-light": "#f6f6f8",
                "background-dark": "#0f1115",
                "surface-dark": "#181b21",
                "glass-border": "rgba(255, 255, 255, 0.08)",
                "glass-surface": "rgba(16, 22, 34, 0.6)",
                "glass-highlight": "rgba(255, 255, 255, 0.03)",
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"],
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "2xl": "2rem",
                "full": "9999px"
            },
            animation: {
                'blob': 'blob 7s infinite',
                'blob-delayed': 'blob 7s infinite 2s',
                'blob-reverse': 'blob-reverse 10s infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                'blob-reverse': {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(-30px, 50px) scale(1.1)' },
                    '66%': { transform: 'translate(20px, -20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                }
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
