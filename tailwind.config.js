/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bread: {
          brown: "#4a3728",
          cream: "#fbf9f6",
          charcoal: "#2b2b2b",
        },
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
