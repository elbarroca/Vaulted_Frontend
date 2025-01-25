import { Header1 } from "@/components/Landing/header"
import { Hero } from "@/components/Landing/animated-hero"
import { FeaturesSectionWithHoverEffects } from "@/components/Landing/feature-section-with-hover-effects"
import { StackedCircularFooter } from "@/components/Landing/stacked-circular-footer"
import { PlatformFeature } from "@/components/Landing/platform-feature"
import { HeroHighlightDemo } from "@/components/Landing/hero-highlight-demo"
import { CanvasRevealEffect } from "@/components/Landing/canvas-reveal-effect"
import { CTASection } from "@/components/Landing/cta-with-rectangle"

export function LandingPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <Header1 />
      
      {/* Hero Section */}
      <Hero />
      <HeroHighlightDemo />

      {/* Features Container with Canvas Background */}
      <div className="relative bg-black">
        {/* Canvas Background */}
        <div className="absolute inset-0 z-0">
          <CanvasRevealEffect
            animationSpeed={0.8}
            colors={[
              [0, 191, 255],
              [0, 255, 180],
              [64, 185, 255],
              [0, 255, 140],
              [0, 128, 255],
              [0, 255, 220],
            ]}
            opacities={[0.2, 0.2, 0.25, 0.25, 0.3, 0.3, 0.35, 0.35, 0.4, 0.4]}
            showGradient={false}
            dotSize={3}
            containerClassName="bg-black"
          />
        </div>

        {/* Platform Feature */}
        <div className="relative z-10">
          <PlatformFeature />
        </div>

        {/* Features Section */}
        <section className="relative z-10 w-full py-20">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Why Choose Vaulted?</h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">Experience the future of secure, decentralized storage designed for modern teams.</p>
            </div>
            <FeaturesSectionWithHoverEffects />
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <CTASection
        badge={{
          text: "🔐 Take Control of Your Privacy"
        }}
        title="Privacy is Your Right"
        description="It's up to you how you protect your data. Use Vaulted for a better, more secure digital experience – where your privacy comes first, always."
        action={{
          text: "Start Protecting Your Data →",
          href: "/auth/sign-up",
          variant: "default"
        }}
        withGlow={false}
      />
      
      {/* Footer */}
      <StackedCircularFooter />
    </div>
  )
} 