/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,jsx,tsx,ts,js}"],
  theme: {
    extend: {
      colors: {
        navy: {
          600: "#2c4a7c",
          700: "#1a2c4d",
          800: "#0f1d33",
          900: "#060d19",
        },
        blue: {
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },
    },
  },
  plugins: [],
};
