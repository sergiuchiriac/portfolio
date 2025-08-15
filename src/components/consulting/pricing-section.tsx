"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BlurFade from "@/components/magicui/blur-fade";
import toast from 'react-hot-toast';
import { useState } from "react";
import { DATA } from "@/data/resume";

interface PricingSectionProps {
  delay: number;
}

export function PricingSection({ delay }: PricingSectionProps) {

  // Separate processing states for each button
  const [isProcessingSingle, setIsProcessingSingle] = useState(false)
  const [isProcessingUnlimited, setIsProcessingUnlimited] = useState(false)

  const handleBuyNow = async (priceId: string, isUnlimited: boolean) => {
    // Set the appropriate processing state based on which button was clicked
    if (isUnlimited) {
      setIsProcessingUnlimited(true)
    } else {
      setIsProcessingSingle(true)
    }

    // Simulate payment processing
    try {
      const checkoutData = {
        priceId: priceId,
        mode: "payment",
        successUrl: `https://sergiuchiriac.com/success`,
        cancelUrl: `https://sergiuchiriac.com/`
      };

      // Default checkout behavior
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        toast.error(`Checkout failed. Please try again or contact support.`)
        // Reset the appropriate processing state
        if (isUnlimited) {
          setIsProcessingUnlimited(false)
        } else {
          setIsProcessingSingle(false)
        }
        return;
      }
      
      const { url } = await response.json();
      
      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (error) {
      // Reset the appropriate processing state
      if (isUnlimited) {
        setIsProcessingUnlimited(false)
      } else {
        setIsProcessingSingle(false)
      }
      toast.error(`Checkout failed. Please try again or contact support.`)
    }
  }

  
  return (
    <section id="pricing" className="mx-auto w-full max-w-5xl space-y-8">
      
      <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Single Call Plan */}
        <BlurFade delay={delay}>
          <Card className="relative group hover:shadow-xl transition-all duration-300 border border-border bg-card">
            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-2xl font-bold">Single Call</CardTitle>
              <div className="space-y-2">
                <div className="text-5xl font-bold">$150</div>
                <CardDescription className="text-base text-muted-foreground max-w-sm mx-auto">
                 
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-sm text-muted-foreground"> Perfect for tackling a specific challenge or getting quick feedback.</span>
                  </div>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <Button onClick={() => handleBuyNow(DATA.stripe.singleCall.priceId, false)} disabled={isProcessingSingle} className="w-full h-12 text-base font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200" size="lg">
                {isProcessingSingle ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Book a Call →"
                )}
              </Button>
            </CardContent>
          </Card>
        </BlurFade>

        {/* Unlimited Calls Plan */}
        <BlurFade delay={delay * 1.5}>
          <Card className="relative bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-neutral-900 p-6 rounded-xl border-2 border-purple-500 dark:border-purple-600/60 text-center shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-purple-500 text-white px-4 py-1.5 rounded-full font-semibold text-xs">
                Save $800 today
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-2xl font-bold">Unlimited Calls*</CardTitle>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-5xl font-bold">$1000</span>
                  <span className="text-2xl text-muted-foreground line-through">$1800</span>
                </div>
                <CardDescription className="text-base text-muted-foreground max-w-sm mx-auto">
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-sm text-muted-foreground">For the next year you get access to my calendar to book as many calls as you want</span>
                  </div>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <Button onClick={() => handleBuyNow(DATA.stripe.unlimitedCalls.priceId, true)} disabled={isProcessingUnlimited} className="w-full h-12 text-base font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200" size="lg">
                {isProcessingUnlimited ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Go Unlimited →"
                )}
              </Button>
            </CardContent>
            
          </Card>
        </BlurFade>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>* Terms and conditions apply. All plans include a 24-hour satisfaction guarantee.</p>
      </div>
    </section>
  );
} 