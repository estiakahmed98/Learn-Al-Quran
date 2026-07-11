import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F6B4C",
          light: "#14895F",
          dark: "#0A4F38"
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#E0BE4B"
        },
        cream: "#FBF8F1"
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-bangla)", "sans-serif"],
        bangla: ["var(--font-bangla)", "sans-serif"]
      },
      backgroundImage: {
        "islamic-pattern": "url('/images/pattern.svg')"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;
