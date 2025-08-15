import BlurFadeText from "@/components/magicui/blur-fade-text";

interface HeroSectionProps {
  delay: number;
}

export function HeroSection({ delay }: HeroSectionProps) {
  return (
    <section className="mb-20 text-center" id="hero">
     <div className="text-center space-y-6">
          <BlurFadeText
            delay={delay}
            className="text-3xl md:text-4xl font-bold tracking-tighter"
            yOffset={8}
            text="💬 1 to 1 Consulting"
          />
          <BlurFadeText
            className="max-w-2xl mx-auto md:text-xl text-muted-foreground leading-relaxed"
            delay={delay * 2}
            text="Ready to grow your audience and scale your online business? Let&apos;s work together to develop a winning strategy."
          />
        </div>
    </section>
  );
} 