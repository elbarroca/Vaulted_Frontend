"use client";
import { useScroll } from "framer-motion";
import { useRef } from "react";
import { TextReveal } from "@/components/Landing/text-reveal";

export function HeroHighlightDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div className="relative w-full flex flex-col items-center justify-center px-4" ref={containerRef}>
      <div className="max-w-3xl mx-auto text-center">
        <TextReveal
          text={`🔒 Your data isn't a product – it's yours. No access, no selling, no AI training – ever. 
            Unlike big corporations, we protect what's yours: fully private, fully decentralized, and untouchable.`}
          className="mb-8"
        />
      </div>
    </div>
  );
}
