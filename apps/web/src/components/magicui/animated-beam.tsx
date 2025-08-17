"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { RefObject, useEffect, useId, useState } from "react";

export interface AnimatedBeamProps {
  className?: string;
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = Math.random() * 3 + 4,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) => {
  const id = useId();
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  const updatePath = () => {
    if (containerRef.current && fromRef.current && toRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();

      const relativeFromX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
      const relativeFromY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
      const relativeToX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
      const relativeToY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;

      const dx = relativeToX - relativeFromX;
      const dy = relativeToY - relativeFromY;
      
      const midX = relativeFromX + dx / 2;
      const midY = relativeFromY + dy / 2;
      
      // Add curvature
      const controlX = midX + curvature * dy * 0.5;
      const controlY = midY - curvature * dx * 0.5;

      const path = `M ${relativeFromX} ${relativeFromY} Q ${controlX} ${controlY} ${relativeToX} ${relativeToY}`;
      setPathD(path);

      setSvgDimensions({
        width: containerRect.width,
        height: containerRect.height,
      });
    }
  };

  useEffect(() => {
    updatePath();

    const resizeObserver = new ResizeObserver(() => {
      updatePath();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset]);

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute left-0 top-0 transform-gpu stroke-2",
        className,
      )}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      <defs>
        <linearGradient
          className="transform-gpu"
          id={id}
          gradientUnits="userSpaceOnUse"
          x1="0%"
          x2="100%"
          y1="0%"
          y2="0%"
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} />
          <stop offset="32.5%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        fill="none"
      />
      <motion.path
        d={pathD}
        stroke={`url(#${id})`}
        strokeWidth={pathWidth}
        fill="none"
        strokeDasharray="20 20"
        initial={{
          strokeDashoffset: reverse ? -40 : 40,
        }}
        animate={{
          strokeDashoffset: reverse ? 40 : -40,
        }}
        transition={{
          delay,
          duration,
          ease: "linear",
          repeat: Infinity,
        }}
      />
    </svg>
  );
};