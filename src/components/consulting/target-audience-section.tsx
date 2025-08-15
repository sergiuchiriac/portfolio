import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlurFade from "@/components/magicui/blur-fade";
import { Lightbulb, Rocket, Users, Sparkles, Search } from "lucide-react";

interface TargetAudienceSectionProps {
  delay: number;
}

export function TargetAudienceSection({ delay }: TargetAudienceSectionProps) {
  const audiences = [
    {
      icon: Lightbulb,
      title: "You Have an Idea",
      description: "You've got this great idea that keeps you up at night. You're excited but also scared of making the wrong moves.",
      points: [
        "You don't know where to start",
        "You're afraid of wasting time",
        "You need someone to believe in you",
      ],
      iconBg: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-500",
    },
    {
      icon: Rocket,
      title: "You're Stuck",
      description: "Your project's growth has hit a wall. You've tried everything you can think of, but nothing seems to work.",
      points: [
        "Your revenue hasn't grown in months",
        "You're out of ideas to scale",
        "Your competitors are moving faster",
      ],
      iconBg: "from-blue-500/20 to-purple-500/20",
      iconColor: "text-blue-500",
    },
    {
      icon: Users,
      title: "Grow An Audience",
      description: "You're sharing your journey but struggling to get noticed. You know you have valuable insights to share.",
      points: [
        "Your content isn't getting traction",
        "You're not sure what to share",
        "You want to build a community",
      ],
      iconBg: "from-green-500/20 to-teal-500/20",
      iconColor: "text-green-500",
    },
    {
      icon: Sparkles,
      title: "Grow Your Startup",
      description: "You're building a startup and need help getting off the ground. You know you have valuable insights to share.",
      points: [
        "You're not sure what to build",
        "You're not sure how to grow",
        "You're not sure how to get users",
      ],
      iconBg: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-500",
    },
    {
      icon: Search,
      title: "Need research",
      description: "You're stuck on organic growth and need help getting off the ground.",
      points: [
        "You are stuck on organic growth",
        "You need keyword research",
        "You need to know what your competitors are doing",
      ],
      iconBg: "from-blue-500/20 to-purple-500/20",
      iconColor: "text-blue-500",
    },
    {
      icon: Lightbulb,
      title: "Need a Second Opinion",
      description: "You're facing big decisions and need someone to bounce ideas off. You want honest feedback.",
      points: [
        "You have tough decisions to make",
        "You're stuck on technical problems",
        "You want honest, no-BS advice",
      ],
      iconBg: "from-pink-500/20 to-rose-500/20",
      iconColor: "text-pink-500",
    },
    
  ];

  return (
    <section id="who-is-this-for" className="mx-auto w-full max-w-6xl space-y-12">
      <div className="text-center space-y-4">
        <BlurFade delay={delay}>
          <h2 className="text-4xl font-bold tracking-tight">Who is this for?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Whether you&apos;re just starting out or hitting a growth plateau, I&apos;ve got you covered
          </p>
        </BlurFade>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {audiences.map((audience, index) => (
          <BlurFade key={audience.title} delay={delay * (1.5 + index * 0.5)}>
            <Card className="px-4 py-6 relative group hover:shadow-xl transition-all duration-300 border border-border bg-card">

              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center space-x-3 text-xl font-bold mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${audience.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <audience.icon className={`h-6 w-6 ${audience.iconColor}`} />
                  </div>
                  <span>{audience.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {audience.description}
                </p>
                <ul className="space-y-3">
                  {audience.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-muted-foreground leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </section>
  );
} 