import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";

interface AboutSectionProps {
  delay: number;
}

export function AboutSection({ delay }: AboutSectionProps) {
  return (
    <section id="who-am-i" className="mx-auto w-full max-w-4xl">
      <BlurFade delay={delay}>
        <h2 className="text-3xl font-bold text-center mb-8">👨‍💻 Who Am I?</h2>
      </BlurFade>
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Hi, I&apos;m {DATA.name.split(" ")[0]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A software engineer turned indie hacker who&apos;s been building online businesses. I quit my job as a software engineer to dive into indie hacking full-time. Since then, I&apos;ve joined several indie projects as a freelancer and made over $70K with my own products.
          </p>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="space-y-2">
              <h4 className="font-semibold">Current Goal</h4>
              <p className="text-sm text-muted-foreground">
                Aiming to hit $10K MRR with tools I&apos;ve built myself till the end of 2025, while helping others along the way.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Experience</h4>
              <p className="text-sm text-muted-foreground">
                Senior Full Stack Engineer with expertise in React, Next.js, AI integration, and building scalable products.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
} 