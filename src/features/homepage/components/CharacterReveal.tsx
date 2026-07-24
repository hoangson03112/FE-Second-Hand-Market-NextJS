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
  isActive,
  className,
}: CharacterRevealProps) {
  return (
    <>
      {text.split("").map((char, index) => (
        <motion.span
          key={`${baseCharIndex}-${index}-${char}`}
          className={className}
          initial={{ opacity: 0, y: "0.4em", filter: "blur(6px)" }}
          animate={
            isActive
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: "0.4em", filter: "blur(6px)" }
          }
          transition={{
            duration: 0.5,
            delay: (baseCharIndex + index) * CHAR_STAGGER,
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
  return extraDelay + charCount * CHAR_STAGGER + 0.5;
}
