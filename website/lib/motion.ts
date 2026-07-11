/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
import { Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const; // Custom cubic-bezier
const DURATION = 0.4; // 400ms

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION,
      ease: EASE,
    },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATION,
      ease: EASE,
    },
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION,
      ease: EASE,
    },
  },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION,
      ease: EASE,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION,
      ease: EASE,
    },
  },
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION,
      ease: EASE,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

export const cardReveal: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION,
      ease: EASE,
    },
  },
};

export const hoverLift = {
  rest: { y: 0 },
  hover: {
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export const hoverScale = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export const buttonPress = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.95 },
};

export const accordionContent = {
  hidden: { height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.2, ease: "easeInOut" } },
};

export const modalScale = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2, ease: "easeIn" } },
};

export const drawerSlide = (direction: "left" | "right" | "bottom" = "right") => {
  const translations = {
    left: { x: "-100%", y: 0 },
    right: { x: "100%", y: 0 },
    bottom: { x: 0, y: "100%" },
  };

  return {
    hidden: translations[direction],
    visible: { x: 0, y: 0, transition: { type: "spring", damping: 25, stiffness: 200 } },
    exit: { ...translations[direction], transition: { type: "spring", damping: 25, stiffness: 200 } },
  };
};

// Note: Ensure <MotionConfig reducedMotion="user"> is applied at the root of the app 
// to automatically respect prefers-reduced-motion for all these variants.
