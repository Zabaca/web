"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "./magicui/animated-beam";
import { SiCalendly, SiStripe, SiShopify } from "react-icons/si";
import { TbApi } from "react-icons/tb";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; style?: React.CSSProperties }
>(({ className, children, style }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 border-border bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
      style={{
        border: '2px solid #131416',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        ...style
      }}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export default function IntegrationDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const calendlyRef = useRef<HTMLDivElement>(null);
  const stripeRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<HTMLDivElement>(null);
  const shopifyRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex w-full items-center justify-center p-10"
      ref={containerRef}
      style={{ 
        position: 'relative', 
        padding: '2rem', 
        maxWidth: '500px', 
        justifySelf: 'center',
        background: 'white',
        border: '3px solid #131416',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        minHeight: '350px'
      }}
    >
      <div className="flex size-full max-w-lg flex-row items-center justify-between gap-8">
        <div className="flex flex-col justify-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <Circle ref={calendlyRef}>
              <SiCalendly size={20} color="#006BFF" />
            </Circle>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#131416', textAlign: 'center' }}>
              Calendly
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <Circle ref={apiRef}>
              <TbApi size={20} color="#131416" />
            </Circle>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#131416', textAlign: 'center' }}>
              Your API
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <Circle ref={stripeRef}>
              <SiStripe size={20} color="#635BFF" />
            </Circle>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#131416', textAlign: 'center' }}>
              Stripe
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <Circle ref={shopifyRef}>
              <SiShopify size={20} color="#95BF47" />
            </Circle>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#131416', textAlign: 'center' }}>
              Shopify
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center">
          <Circle ref={hubRef} className="size-16" style={{ 
            width: '80px', 
            height: '80px', 
            background: '#131416',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Fredoka, sans-serif' }}>
              Z
            </div>
            <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 500, marginTop: '2px' }}>
              Zabaca
            </span>
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={calendlyRef}
        toRef={hubRef}
        duration={3}
        gradientStartColor="#00c2ff"
        gradientStopColor="#00c2ff"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={stripeRef}
        toRef={hubRef}
        duration={3}
        delay={0.5}
        gradientStartColor="#00c2ff"
        gradientStopColor="#00c2ff"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={apiRef}
        toRef={hubRef}
        duration={3}
        delay={1}
        gradientStartColor="#00c2ff"
        gradientStopColor="#00c2ff"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={shopifyRef}
        toRef={hubRef}
        duration={3}
        delay={1.5}
        gradientStartColor="#00c2ff"
        gradientStopColor="#00c2ff"
      />
      
      {/* OAuth Badge */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        background: '#4ff37d',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: '#131416',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transform: 'rotate(-5deg)'
      }}>
        <div>🔒</div>
        <span>Secure OAuth</span>
      </div>
    </div>
  );
}