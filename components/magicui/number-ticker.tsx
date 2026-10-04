"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number;
  decimalPlaces?: number;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(direction === "down" ? value : 0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const duration = 1000;
    const startValue = direction === "down" ? value : 0;
    const targetValue = value;

    const timeout = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
        // easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = startValue + (targetValue - startValue) * easeProgress;

        setDisplayValue(Number(current.toFixed(decimalPlaces)));

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, direction, delay, decimalPlaces]);

  return (
    <span className={cn("inline-block tabular-nums tracking-tight font-semibold", className)}>
      {displayValue.toLocaleString()}
    </span>
  );
}
