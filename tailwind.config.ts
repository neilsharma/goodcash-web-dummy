import type { Config } from "tailwindcss";

function withOpacity(variableName: string): any {
  return ({ opacityValue }: { opacityValue: string }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgba(var(${variableName}))`;
  };
}

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      textColor: {
        text: withOpacity("--text"),
        boldText: withOpacity("--boldText"),
        thinText: withOpacity("--thinText"),
        error: withOpacity("--error"),
      },
      backgroundColor: {
        primary: withOpacity("--primary"),
        bgPrimary: withOpacity("--bgPrimary"),
        bgLight: withOpacity("--bgLight"),
        error: withOpacity("--error"),
      },
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
        base: ["var(--font-base)"],
        headingOne: ["var(--font-headingOne)"],
        headingTwo: ["var(--font-headingTwo)"],
        headingThree: ["var(--font-headingThree)"],
        "text-main": ["var(--font-text-main)"],
        "text-sub": ["var(--font-text-sub)"],
        kansasNew: ["KansasNew-Regular"],
        kansasNewMedium: ["KansasNew-Medium"],
        kansasNewSemiBold: ["KansasNew-SemiBold"],
        base2: ["KansasNew-Bold"],
        sharpGroteskBook: ["SharpGrotesk-Book"],
        sharpGroteskMedium: ["SharpGrotesk-Medium"],
      },
      animation: {
        fastSpin: "spin 0.7s linear infinite",
      },
      backgroundImage: {
        "cqr-background": "url('/img/cqr-background.svg')",
        "cqr-grass": "url('/img/cqr-grass-field.svg')",
      },
    },
  },
  plugins: [],
} satisfies Config;
