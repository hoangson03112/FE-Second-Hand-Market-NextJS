"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

// -----------------------------------------------------------------------------
// The Unified Fluid Current (Full-Bleed Immersive Hero)
// Ultra-premium, mathematical HTML5 Canvas fluid simulation stretching 100% width.
// Color Sync: #5FB160, #BFE0BD, #8A8F87, #1A1D1A, #EDF0EF
// -----------------------------------------------------------------------------

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
          "191, 224, 189",
          18,
          safeHeight * 0.6,
          0.0006,
          0.0012,
          3,
          110,
          safeWidth,
        ),
        new SilkRibbon(
          "95, 177, 96",
          14,
          safeHeight * 0.5,
          0.0009,
          0.0016,
          2,
          80,
          safeWidth,
        ),
        new SilkRibbon(
          "138, 143, 135",
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
  const [reducedMotion, setReducedMotion] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    )
      return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

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
      className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, #F8F9F7 0%, #F1F2F0 55%, var(--background) 100%)",
        }}
      />
      <FullBleedFluidCanvas
        mousePos={mousePos}
        isHovered={isHovered}
        reducedMotion={reducedMotion}
      />
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-8 py-20 flex flex-col items-center text-center pointer-events-none drop-shadow-sm">
        <h1
          className="mb-8 text-foreground"
          style={{
            fontFamily: "var(--font-droid-serif), serif",
            fontSize: "clamp(3rem, 7.5vw, 5.5rem)",
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          Nơi{" "}
          <span className="text-accent" style={{ letterSpacing: "-0.02em" }}>
            mọi thứ
          </span>
          <br />
          <span style={{ display: "inline-block", marginTop: "8px" }}>
            đều có thể bán
          </span>
        </h1>
        <p className="text-lg md:text-xl leading-relaxed mb-12 max-w-2xl text-[#1A1D1A]/70 font-medium">
          Tham gia mạng lưới chợ đồ cũ trực tuyến miễn phí — mua bán sản phẩm
          second-hand chỉ với vài cú nhấp chuột.
        </p>

        {/* CTA */}
        <div className="pointer-events-auto">
          <Link
            href="/sell"
            className="group relative inline-flex items-center justify-center px-12 py-5 text-sm font-medium uppercase tracking-[0.25em] text-white transition-all duration-300 hover:scale-105"
            style={{ background: "#333333", borderRadius: "3px" }}
          >
            {/* Hover glow effect for the button */}
            <div className="absolute inset-0 bg-[#5FB160] opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md rounded-lg" />
            <span className="relative z-10">Bắt đầu bán</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
