"use client";

import { motion } from "motion/react";

const CHAR_STAGGER = 0.042;

interface CharacterRevealProps {
  text: string;
  baseCharIndex?: number;
  isActive: boolean;
  className?: string;
}

export function CharacterReveal({
  text,
  baseCharIndex = 0,
  isActive = true,
  className,
}: CharacterRevealProps) {
  return (
    <>
      {text.split("").map((char, index) => (
        <motion.span
          key={`${baseCharIndex}-${index}-${char}`}
          className={className}
          initial={false}
          animate={
            isActive
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0.8, y: 0, filter: "blur(0px)" }
          }
          transition={{
            duration: 0.35,
            delay: (baseCharIndex + index) * 0.015,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </>
  );
}

export function getCharacterRevealDuration(
  charCount: number,
  extraDelay = 0,
): number {
  return extraDelay + charCount * 0.015 + 0.2;
}
