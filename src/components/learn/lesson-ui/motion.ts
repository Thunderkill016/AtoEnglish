export const lessonSectionMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { type: "spring", stiffness: 280, damping: 26, mass: 0.8 } as const,
};