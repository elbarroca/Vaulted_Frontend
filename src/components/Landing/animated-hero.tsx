import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { RainbowButton } from "@/components/Landing/rainbow-button";
import { Squares } from "@/components/Landing/squares-background";
import { HeroPill } from "@/components/Landing/hero-pill";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      "Your Privacy.",
      "Truly Decentralized.",
      "No Exceptions.",
      "Your Access Only"
    ],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2500);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  const getRandomAnimation = (index: number) => {
    const animations = [
      { y: titleNumber > index ? "-120%" : "120%", x: "0%" },
      { y: titleNumber > index ? "-150%" : "150%", x: "0%" },
      { y: titleNumber > index ? "-130%" : "130%", x: "0%" },
    ];
    return {
      y: animations[index % animations.length].y,
      x: "0%",
      opacity: 0,
      scale: titleNumber > index ? 0.9 : 1.1,
    };
  };

  return (
    <div className="w-full relative min-h-[90vh] bg-background overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Squares 
          className="absolute inset-0"
          direction="diagonal"
          speed={0.5}
          borderColor="rgba(59, 130, 246, 0.2)"
          squareSize={30}
          hoverFillColor="rgba(59, 130, 246, 0.1)"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto relative z-10 px-4">
        <div className="flex gap-8 py-12 lg:py-32 min-h-[90vh] items-center justify-center flex-col">
          <div className="flex gap-8 flex-col max-w-3xl w-full">
            <div className="flex justify-center">
              <HeroPill 
                href="#"
                label="Welcome to Vaulted"
                announcement="🌐"
                className="bg-blue-500/10 hover:bg-blue-500/20 ring-1 ring-blue-500/20 transition-all duration-300
                [&_div]:bg-blue-500/20 [&_div]:text-blue-400 
                [&_p]:text-blue-400 hover:[&_p]:text-blue-300
                [&_svg_path]:fill-blue-400"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl tracking-tighter text-center font-regular">
              <span className="text-white block mb-2">Your Data, Your Rules</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center h-24 md:h-28">
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 max-w-3xl px-4"
                    initial={getRandomAnimation(index)}
                    transition={{ 
                      type: "spring", 
                      stiffness: 45,
                      damping: 12,
                      mass: 1.3,
                      velocity: 2
                    }}
                    animate={
                      titleNumber === index
                        ? {
                            y: "0%",
                            x: "0%",
                            opacity: 1,
                            scale: 1,
                          }
                        : getRandomAnimation(index)
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-white/80 text-center mx-auto">
              Decentralized, secure, and truly yours – take full control of your data today.
            </p>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-4"
          >
            <RainbowButton 
              className="text-lg px-12 py-6 rounded-2xl hover:scale-105 transition-transform duration-500 flex items-center gap-2 font-medium"
            >
              Get Started <MoveRight className="w-5 h-5" />
            </RainbowButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
