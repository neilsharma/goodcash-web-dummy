/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#296B4A",
        bgPrimary: "#F1F4EA",
        text: "#333836",
        boldText: "#0F100F",
      },
      fontFamily: {
        kansasNew: ["KansasNew-Regular"],
        kansasNewMedium: ["KansasNew-Medium"],
        kansasNewSemiBold: ["KansasNew-SemiBold"],
        kansasNewBold: ["KansasNew-Bold"],
        sharpGroteskBook: ["SharpGrotesk-Book"],
        sharpGroteskMedium: ["SharpGrotesk-Medium"],
      },
    },
  },
  plugins: [],
};
