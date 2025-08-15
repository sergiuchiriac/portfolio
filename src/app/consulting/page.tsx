import {
  HeroSection,
  PricingSection,
  BenefitsSection,
  TargetAudienceSection,
  FAQSection,
  CTASection,
} from "@/components/consulting";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";

const BLUR_FADE_DELAY = 0.04;

export default function ConsultingPage() {
  return (
    <>
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "fixed inset-0 h-full w-full skew-y-12",
        )}
      />
      <main className="max-w-5xl mx-auto relative z-10">
        <HeroSection delay={BLUR_FADE_DELAY} />
        <PricingSection delay={BLUR_FADE_DELAY * 3} />
        <BenefitsSection delay={BLUR_FADE_DELAY * 5} />
        <TargetAudienceSection delay={BLUR_FADE_DELAY * 13} />
        <FAQSection delay={BLUR_FADE_DELAY * 19} />
        <CTASection delay={BLUR_FADE_DELAY * 24} />
      </main>
    </>
  );
}
