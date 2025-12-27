/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Subtle Animated Gradient Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(251, 146, 60, 0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(96, 165, 250, 0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(251, 146, 60, 0.08) 0%, transparent 60%),
              linear-gradient(135deg, rgba(255, 247, 237, 0.98) 0%, rgba(239, 246, 255, 0.98) 50%, rgba(255, 247, 237, 0.98) 100%)
            `,
            backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%",
            animation: "meshMove 30s ease infinite",
          }}
        />

        {/* Subtle Floating Orbs - Orange */}
        <div
          className="absolute top-20 left-20 w-96 h-96 bg-orange-200/25 rounded-full blur-3xl"
          style={{
            animation: "floatOrb 25s ease-in-out infinite",
            animationDelay: "0s",
          }}
        />
        <div
          className="absolute bottom-32 left-1/4 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl"
          style={{
            animation: "floatOrb 28s ease-in-out infinite",
            animationDelay: "10s",
          }}
        />

        {/* Subtle Floating Orbs - Blue */}
        <div
          className="absolute top-60 right-1/3 w-[400px] h-[400px] bg-blue-200/25 rounded-full blur-3xl"
          style={{
            animation: "floatOrb 26s ease-in-out infinite",
            animationDelay: "5s",
          }}
        />
        <div
          className="absolute bottom-40 right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
          style={{
            animation: "floatOrb 27s ease-in-out infinite",
            animationDelay: "15s",
          }}
        />
      </div>

      {/* Subtle Cursor Light Effect */}
      <div
        className="pointer-events-none fixed w-80 h-80 rounded-full filter blur-3xl transition-all duration-500 z-0"
        style={{
          left: `${mousePosition.x - 160}px`,
          top: `${mousePosition.y - 160}px`,
          background: `radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, rgba(96, 165, 250, 0.15) 50%, transparent 70%)`,
          opacity: 0.2,
        }}
      />
    </>
  );
};

export default AnimatedBackground;
