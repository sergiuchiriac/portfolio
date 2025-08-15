import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlurFade from "@/components/magicui/blur-fade";
import { HelpCircle, Sparkles } from "lucide-react";

interface FAQSectionProps {
  delay: number;
}

export function FAQSection({ delay }: FAQSectionProps) {
  const faqs = [
    {
      question: "How long do I get access?",
      answer: (
        <>
          <strong>Single Call:</strong> One video call, must be used within 1st year of purchase.<br/>
          <strong>Unlimited Calls:</strong> Unlimited calls for 1 year from the date of purchase.
        </>
      ),
    },
    {
      question: "What can we discuss?",
      answer: "Anything related to building online businesses: product ideas, growth strategies, pricing, marketing, mindset, technical challenges, SEO, keyword research, programatic SEO, competition analysis, content strategy, backlink building, and more. I share everything I learn in real-time.",
    },
    {
      question: "How do the calls work?",
      answer: "After purchasing, you'll receive a private booking link (Calendly) to schedule your video call(s) at a time that works for you. For the unlimited plan, you can use the same link repeatedly.",
    },
    {
      question: "What's your refund policy?",
      answer:
      <>
      All plans come with a satisfaction guarantee. If you&apos;re not happy with the value you receive from your <strong>first</strong> call, simply email me within 24 hours after the call, and I&apos;ll issue a full refund for that plan.
      </>
    },
  ];

  return (
    <section id="faq" className="mx-auto w-full max-w-5xl space-y-12 py-16">
      <div className="text-center space-y-4">
        <BlurFade delay={delay}>
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Common Questions</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight">🤔 Everything You Need to Know</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Got questions? Here are the answers to the most common ones
          </p>
        </BlurFade>
      </div>
      
      <div className="grid gap-6 max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <BlurFade key={faq.question} delay={delay * (1.5 + index * 0.5)}>
            <Card className="px-4 py-6 group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-r from-card/50 to-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <HelpCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span>{faq.question}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed pl-11">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </section>
  );
} 