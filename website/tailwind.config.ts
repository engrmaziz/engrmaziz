import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        base: "var(--color-bg-base)",
        elevated: "var(--color-bg-elevated)",
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        "border-default": "var(--color-border-default)",
        "border-elevated": "var(--color-border-elevated)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      transitionTimingFunction: {
        "custom-ease": "var(--motion-easing-default)",
      },
      transitionDuration: {
        "fast": "var(--motion-duration-fast)",
        "normal": "var(--motion-duration-normal)",
        "slow": "var(--motion-duration-slow)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        marquee: "marquee 80s linear infinite",
        "marquee-reverse": "marquee-reverse 80s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
