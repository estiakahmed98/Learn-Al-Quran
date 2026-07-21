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
          DEFAULT: "#28504F",
          light: "#5F9A6B",
          dark: "#11674A"
        },
        secondary: {
          DEFAULT: "#5F9A6B",
          light: "#7DB287"
        },
        gold: {
          DEFAULT: "#E9C99B",
          light: "#F2DEBD"
        },
        cream: "#FAFAFA"
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-bangla)", "sans-serif"],
        bangla: ["var(--font-bangla)", "sans-serif"]
      },
      backgroundImage: {
        "islamic-pattern": "url('/images/pattern.svg')"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        marquee: "marquee 32s linear infinite"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;
