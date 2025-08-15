"use client";

import { Button } from "@/components/ui/button";
import BlurFade from "@/components/magicui/blur-fade";
import { ArrowRight, Sparkles, Star } from "lucide-react";

interface CTASectionProps {
  delay: number;
}

export function CTASection({ delay }: CTASectionProps) {
  return (
    <section id="cta" className="mx-auto w-full max-w-4xl">
      <BlurFade delay={delay}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-neutral-900 border-2 border-purple-500 dark:border-purple-600/60 p-12 text-center">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-primary px-4 py-2 rounded-full text-sm font-medium border border-purple-500/30">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span>Ready to Get Started?</span>
            </div>
            
            <h2 className="text-4xl font-bold tracking-tight">Transform Your Business Today</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Don&apos;t let another day pass without taking action. Join dozens of entrepreneurs who&apos;ve already accelerated their growth with my guidance.
            </p>
            
            {/* Social proof */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span>100% Satisfaction Guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span>24/7 Support Available</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                onClick={() => {
                  document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Book Your First Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 text-base font-semibold border-2 hover:bg-primary/5 hover:border-primary/30"
                onClick={() => {
                  window.open('https://x.com/intent/follow?screen_name=s_chiriac', '_blank');
                }}
              >
                Schedule a Free Chat
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground pt-4">
              Have more questions? Reach out via email and I&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </BlurFade>
    </section>
  );
} 