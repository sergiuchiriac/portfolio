import { Target } from "lucide-react";
import BlurFade from "../magicui/blur-fade";

interface BenefitsSectionProps {
  delay?: number;
}

export function BenefitsSection({ delay }: BenefitsSectionProps) {
  return (
    <BlurFade delay={delay}>
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <Target className="w-6 h-6 text-blue-400" />
            <h2 className="text-4xl font-bold text-foreground">What You Get</h2>
          </div>

          {/* Benefits Card */}
          <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="space-y-6">
              {/* Benefit 1 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-semibold text-sm">1</span>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold text-lg mb-2">Targeted Video Calls</h3>
                  <p className="text-gray-300">Book 30min Video calls tailored to your chosen plan, focusing on your specific needs and goals.</p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-semibold text-sm">2</span>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold text-lg mb-2">Direct Access to My Journey and Knowledge</h3>
                  <p className="text-gray-300">Get real-time insights and strategies from my ongoing journey. Learn from my successes and failures to apply to your own path.</p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-semibold text-sm">3</span>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold text-lg mb-2">Personalized Support</h3>
                  <p className="text-gray-300">Receive personalized attention and guidance to help you overcome obstacles and achieve success. (Priority for Unlimited plan).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BlurFade>
  );
} 