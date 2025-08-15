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
import { Metadata } from "next";

const BLUR_FADE_DELAY = 0.04;

export const metadata: Metadata = {
  title: "Consulting Services",
  description: "Professional consulting services in software development, system architecture, and digital transformation. Expert guidance for your technical projects and business needs.",
  keywords: [
    "consulting",
    "software development",
    "system architecture", 
    "digital transformation",
    "technical guidance",
    "business consulting",
    "software consulting"
  ],
  openGraph: {
    title: "Consulting Services | Sergio Chiriac",
    description: "Professional consulting services in software development, system architecture, and digital transformation.",
    type: "website",
    url: "https://sergiuchiriac.com/consulting",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sergio Chiriac Consulting Services"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Consulting Services | Sergio Chiriac",
    description: "Professional consulting services in software development, system architecture, and digital transformation.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "https://sergiuchiriac.com/consulting",
  },
};

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
