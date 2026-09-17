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
      // `base` is a BACKGROUND color. Never use `text-base` / `sm:text-base` for type size —
      // those utilities paint navy (`--color-bg-base`) and hide outline buttons on dark UI.
      fontSize: {
        copy: ["1rem", { lineHeight: "1.5" }],
      },
      colors: {
        base: "var(--color-bg-base)",
        elevated: "var(--color-bg-elevated)",
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        "border-default": "var(--color-border-default)",
        "border-elevated": "var(--color-border-elevated)",
        gold: "var(--color-gold)",
        "gold-hover": "var(--color-gold-hover)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-syne)", "var(--font-inter)", "sans-serif"],
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
        "hud-scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(220%)" },
        },
        shine: {
          "0%": { transform: "translateX(-120%) skewX(-16deg)" },
          "100%": { transform: "translateX(220%) skewX(-16deg)" },
        },
        "beam-spin": {
          "0%": { "--beam-angle": "0deg" },
          "100%": { "--beam-angle": "360deg" },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "rotate(215deg) translateX(-520px)", opacity: "0" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "orbit-rev": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" },
        },
      },
      animation: {
        marquee: "marquee 48s linear infinite",
        "marquee-reverse": "marquee-reverse 48s linear infinite",
        "hud-scan": "hud-scan 4.5s linear infinite",
        shine: "shine 1.8s ease-in-out infinite",
        "beam-spin": "beam-spin 5s linear infinite",
        meteor: "meteor 5s linear infinite",
        orbit: "orbit 28s linear infinite",
        "orbit-rev": "orbit-rev 18s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
