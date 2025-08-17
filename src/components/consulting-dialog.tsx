"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

export default function ConsultingDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the dialog
    const dismissed = localStorage.getItem('consulting-dialog-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('consulting-dialog-dismissed', 'true');
  };

  const handleClick = () => {
    router.push('/consulting');
  };

  // Don't show dialog on consulting page
  if (pathname === '/consulting' || isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 ease-out ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      <Card className="flex items-center gap-3 p-3 sm:p-4 bg-card border border-border text-card-foreground shadow-lg max-w-xs sm:max-w-sm cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleClick}>
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
          <AvatarImage src="/me.png" alt="Profile" />
          <AvatarFallback className="bg-purple-600 text-white">
            SC
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm leading-tight">
            Want to build your online{" "}
            <span className="text-purple-500 dark:text-purple-400 font-medium">business?</span>{" "}
            <span className="text-purple-500 dark:text-purple-400 font-medium">Let&apos;s talk</span>{" "}
            <span className="text-purple-500 dark:text-purple-400">→</span>
          </p>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Close dialog"
        >
          <X size={16} />
        </button>
      </Card>
    </div>
  );
} 