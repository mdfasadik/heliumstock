module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#041C32",
        secondary: "#04293A",
        tertiary: "#064663",
        signature: "#ECB365",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
