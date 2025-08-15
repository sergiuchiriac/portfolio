import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlurFade from "@/components/magicui/blur-fade";
import { Rocket, Lightbulb, Star } from "lucide-react";

interface WhyItWorksSectionProps {
  delay: number;
}

export function WhyItWorksSection({ delay }: WhyItWorksSectionProps) {
  const reasons = [
    {
      icon: Rocket,
      title: "Active Learning",
      description: "I&apos;m actively building and learning myself, sharing practical insights from the trenches.",
    },
    {
      icon: Lightbulb,
      title: "No Fluff",
      description: "Get straight, actionable advice based on my real experiences building multiple online businesses.",
    },
    {
      icon: Star,
      title: "Proven Experience",
      description: "Learn from someone who&apos;s successfully built and sold businesses, with over $70K in revenue.",
    },
  ];

  return (
    <section id="why-it-works" className="mx-auto w-full max-w-4xl">
      <BlurFade delay={delay}>
        <h2 className="text-3xl font-bold text-center mb-8">⚡️ Why It Works</h2>
      </BlurFade>
      <div className="grid md:grid-cols-3 gap-6">
        {reasons.map((reason, index) => (
          <BlurFade key={reason.title} delay={delay * (1.5 + index * 0.5)}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <reason.icon className="h-5 w-5 text-primary" />
                  <span>{reason.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{reason.description}</p>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </section>
  );
} 