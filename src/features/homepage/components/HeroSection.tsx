"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CharacterReveal, getCharacterRevealDuration } from "./CharacterReveal";
import { usePrefersReducedMotion } from "../hooks";

const RIBBON_COLORS = {
  taupe200: "191, 221, 188",
  accent: "95, 177, 96",
  neutral500: "98, 98, 111",
} as const;

class SilkRibbon {
  points: { x: number; y: number; baseY: number; vy: number }[];
  colorRGB: string;
  numLayers: number;
  waveSpeed: number;
  waveFreq: number;
  spread: number;
  amplitude: number;

  constructor(
    colorRGB: string,
    numLayers: number,
    baseY: number,
    waveSpeed: number,
    waveFreq: number,
    spread: number,
    amplitude: number,
    width: number,
  ) {
    this.colorRGB = colorRGB;
    this.numLayers = numLayers;
    this.waveSpeed = waveSpeed;
    this.waveFreq = waveFreq;
    this.spread = spread;
    this.amplitude = amplitude;
    this.points = [];

    const step = Math.max(28, Math.round(width / 40));
    const numPoints = Math.ceil(width / step) + 1;
    for (let i = 0; i <= numPoints; i++) {
      this.points.push({ x: i * step, y: baseY, baseY, vy: 0 });
    }
  }

  updateAndDraw(
    ctx: CanvasRenderingContext2D,
    time: number,
    mouseX: number,
    mouseY: number,
    isHovered: boolean,
  ) {
    this.points.forEach((p) => {
      let targetY =
        p.baseY +
        Math.sin(p.x * this.waveFreq + time * this.waveSpeed) * this.amplitude;

      if (isHovered) {
        const dx = mouseX - p.x;
        const dy = mouseY - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 260;

        if (dist < maxDist) {
          const force = Math.pow((maxDist - dist) / maxDist, 2.1);
          targetY -= Math.sign(dy) * force * 140;
        }
      }

      const stiffness = 0.04;
      const damping = 0.9;
      const accel = (targetY - p.y) * stiffness;
      p.vy = (p.vy + accel) * damping;
      p.y += p.vy;
    });

    for (let i = 0; i < this.numLayers; i++) {
      ctx.beginPath();

      const layerPoints = this.points.map((p) => {
        const twist = Math.sin(
          p.x * this.waveFreq * 1.25 + time * (this.waveSpeed * 1.1) + i * 0.04,
        );
        return {
          x: p.x,
          y: p.y + twist * (i * this.spread),
        };
      });

      ctx.moveTo(layerPoints[0].x, layerPoints[0].y);

      for (let j = 1; j < layerPoints.length - 1; j++) {
        const xc = (layerPoints[j].x + layerPoints[j + 1].x) / 2;
        const yc = (layerPoints[j].y + layerPoints[j + 1].y) / 2;
        ctx.quadraticCurveTo(layerPoints[j].x, layerPoints[j].y, xc, yc);
      }

      const lastIdx = layerPoints.length - 1;
      ctx.quadraticCurveTo(
        layerPoints[lastIdx - 1].x,
        layerPoints[lastIdx - 1].y,
        layerPoints[lastIdx].x,
        layerPoints[lastIdx].y,
      );

      const alpha = 0.02 + (1 - i / this.numLayers) * 0.07;
      ctx.strokeStyle = `rgba(${this.colorRGB}, ${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
  }
}

function FullBleedFluidCanvas({
  mousePos,
  isHovered,
  reducedMotion,
}: {
  mousePos: { x: number; y: number };
  isHovered: boolean;
  reducedMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ribbonsRef = useRef<SilkRibbon[]>([]);

  const mouseRef = useRef(mousePos);
  const hoverRef = useRef(isHovered);

  useEffect(() => {
    mouseRef.current = mousePos;
    hoverRef.current = isHovered;
  }, [mousePos, isHovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let logicalWidth = canvas.offsetWidth;
    let logicalHeight = canvas.offsetHeight;
    let animationId: number | null = null;
    const startTime = performance.now();

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      logicalWidth = canvas.offsetWidth;
      logicalHeight = canvas.offsetHeight;
      canvas.width = Math.round(logicalWidth * dpr);
      canvas.height = Math.round(logicalHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initRibbons = () => {
      const safeWidth = Math.max(320, logicalWidth);
      const safeHeight = Math.max(320, logicalHeight);
      ribbonsRef.current = [
        new SilkRibbon(
          RIBBON_COLORS.taupe200,
          18,
          safeHeight * 0.6,
          0.0006,
          0.0012,
          3,
          110,
          safeWidth,
        ),
        new SilkRibbon(
          RIBBON_COLORS.accent,
          14,
          safeHeight * 0.5,
          0.0009,
          0.0016,
          2,
          80,
          safeWidth,
        ),
        new SilkRibbon(
          RIBBON_COLORS.neutral500,
          8,
          safeHeight * 0.4,
          0.0013,
          0.0022,
          1,
          45,
          safeWidth,
        ),
      ];
    };
    resizeCanvas();
    initRibbons();

    const render = (now: number) => {
      if (!reducedMotion) {
        ctx.clearRect(0, 0, logicalWidth, logicalHeight);
        const time = now - startTime;
        ctx.globalCompositeOperation = "source-over";

        ribbonsRef.current.forEach((ribbon) => {
          ribbon.updateAndDraw(
            ctx,
            time,
            mouseRef.current.x,
            mouseRef.current.y,
            hoverRef.current,
          );
        });
      }
      animationId = requestAnimationFrame(render);
    };

    if (!reducedMotion) {
      animationId = requestAnimationFrame(render);
    }

    const handleResize = () => {
      resizeCanvas();
      initRibbons();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [textReady, setTextReady] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<number | null>(null);

  const heroLine1Part1 = "Nơi ";
  const heroLine1Part2 = "mọi thứ";
  const heroLine2 = "đều có thể bán";
  const heroCharCount =
    heroLine1Part1.length + heroLine1Part2.length + heroLine2.length;
  const subtitleStartDelay = getCharacterRevealDuration(heroCharCount, 0.15);

  useEffect(() => {
    if (reducedMotion) {
      setTextReady(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setTextReady(true);
    }, 1100);

    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
      frameRef.current = null;
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-taupe-200/30 blur-3xl animate-hero-glow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-luxury-champagne/15 blur-3xl animate-hero-glow"
        style={{ animationDelay: "2s" }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% -10%, var(--cream-50) 0%, var(--cream-100) 42%, var(--cream-200) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 40%, color-mix(in srgb, var(--luxury-ink) 4%, transparent) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <motion.div
        className="absolute inset-0 z-[2]"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <FullBleedFluidCanvas
          mousePos={mousePos}
          isHovered={isHovered}
          reducedMotion={reducedMotion}
        />
      </motion.div>
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-8  pb-24 flex flex-col items-center text-center pointer-events-none">
        <motion.div
          className="mb-8 flex items-center gap-3"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={textReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{
            duration: 0.6,
            delay: reducedMotion ? 0 : 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span className="h-px w-10 bg-luxury-champagne/90" aria-hidden />
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-neutral-600">
            Nền tảng đồ cũ cao cấp
          </p>
          <span className="h-px w-10 bg-luxury-champagne/90" aria-hidden />
        </motion.div>

        <h1
          className="mb-8 text-luxury-ink"
          style={{
            fontFamily: "var(--font-droid-serif), serif",
            fontSize: "clamp(3rem, 7.5vw, 5.5rem)",
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          <span className="block relative">
            <motion.span
              aria-hidden
              className="pointer-events-none absolute rounded-full bg-accent/35"
              style={{
                width: "clamp(8rem, 5vw, 9rem)",
                height: "clamp(8rem, 5vw, 9rem)",
                left: "clamp(-2rem, -2.5vw, -0rem)",
                top: "clamp(-4.5rem, -6vw, -2rem)",
                zIndex: -1,
              }}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.6 }}
              animate={
                textReady
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.6 }
              }
              transition={{
                duration: 0.7,
                delay: reducedMotion ? 0 : 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            <CharacterReveal
              text={heroLine1Part1}
              baseCharIndex={0}
              isActive={textReady}
            />
            <span className="text-accent" style={{ letterSpacing: "-0.02em" }}>
              <CharacterReveal
                text={heroLine1Part2}
                baseCharIndex={heroLine1Part1.length}
                isActive={textReady}
              />
            </span>
          </span>
          <span
            className="block"
            style={{ display: "inline-block", marginTop: "8px" }}
          >
            <CharacterReveal
              text={heroLine2}
              baseCharIndex={heroLine1Part1.length + heroLine1Part2.length}
              isActive={textReady}
            />
          </span>
        </h1>
        <motion.p
          className="text-base md:text-lg leading-relaxed mb-10 max-w-2xl text-neutral-700/85 font-normal"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={textReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{
            duration: 0.7,
            delay: reducedMotion ? 0 : subtitleStartDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Khám phá những món đồ được tuyển chọn kỹ lưỡng — mua bán an toàn, minh
          bạch và bền vững trong không gian sang trọng.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="pointer-events-auto flex flex-col items-center gap-4 sm:flex-row sm:gap-5"
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={textReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.65,
            delay: reducedMotion ? 0 : subtitleStartDelay + 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Link
            href="/products"
            className="group relative inline-flex min-w-[220px] items-center justify-center rounded-[2px] bg-luxury-ink px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-15 blur-md" />
            <span className="relative z-10">Khám phá bộ sưu tập</span>
          </Link>
          <Link
            href="/sell"
            className="inline-flex min-w-[220px] items-center justify-center rounded-[2px] border border-luxury-ink/20 bg-white/50 px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-luxury-ink backdrop-blur-sm transition-all duration-300 hover:border-luxury-ink/40 hover:bg-white/80"
          >
            Bắt đầu bán
          </Link>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={textReady ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: reducedMotion ? 0 : 2.8, duration: 0.8 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-600/70">
            Cuộn xuống
          </span>
          <div className="h-10 w-px bg-gradient-to-b from-luxury-champagne/80 to-transparent animate-scroll-hint" />
        </div>
      </motion.div>
    </section>
  );
}
