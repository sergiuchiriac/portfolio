'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Mail, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Confetti from 'react-confetti';

export default function SuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main className="max-w-5xl mx-auto relative z-10">
    <div className="min-h-screen flex items-center justify-center p-4">
        
      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          colors={['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa', '#f59e0b', '#10b981', '#3b82f6']}
        />
      )}

      <div className="max-w-md w-full">
        
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful! 🎉
            </h1>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Thank you for your purchase! Your payment has been processed successfully.
            </p>

            {/* Email Notification */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <Mail className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">
                  Check Your Email
                </span>
              </div>
              <p className="text-sm text-blue-700">
                I&apos;ve sent all the details and access instructions to your email address.
                Please check your inbox (and spam folder).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </main>
  );
}
