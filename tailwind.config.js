/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#296B4A",
        bgPrimary: "#F1F4EA",
        text: "#333836",
        boldText: "#0F100F",
        thinText: "#565D59",
        error: "#CE0D35",
        bgLight: "#E4EFC9",
      },
      fontFamily: {
        kansasNew: ["KansasNew-Regular"],
        kansasNewMedium: ["KansasNew-Medium"],
        kansasNewSemiBold: ["KansasNew-SemiBold"],
        kansasNewBold: ["KansasNew-Bold"],
        sharpGroteskBook: ["SharpGrotesk-Book"],
        sharpGroteskMedium: ["SharpGrotesk-Medium"],
      },
      animation: {
        fastSpin: "spin 0.7s linear infinite",
      },
    },
  },
  plugins: [],
};
