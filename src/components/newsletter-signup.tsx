"use client";

import { useState } from "react";
import { joinNewsletter } from "../lib/newsletter";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const result = await joinNewsletter(email);
      
      if (result.success) {
        setIsSubscribed(true);
        setEmail("");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="bg-gradient-to-br from-purple-100 to-white dark:from-purple-900/20 dark:to-neutral-900 p-6 rounded-xl border-2 border-purple-500 dark:border-purple-600/60 text-center shadow-lg max-w-2xl mx-auto mb-20">
        <div className="text-green-600 dark:text-green-400 text-6xl mb-4">✓</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Welcome to the newsletter!
        </h3>
        <p className="text-gray-700 dark:text-purple-200">
          You&apos;ll receive updates about new articles and insights.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-100 to-white dark:from-purple-900/20 dark:to-neutral-900 p-6 rounded-xl border-2 border-purple-500 dark:border-purple-600/60 text-center shadow-lg hover:shadow-xl transition-all duration-300 max-w-2xl mx-auto mb-20">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Want to stay updated?
        </h3>
        <p className="text-xl text-gray-700 dark:text-white">
          Sign up for the newsletter.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="w-full sm:flex-1 max-w-md px-4 py-3 bg-white dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 transition-all text-base border border-gray-300 dark:border-gray-600"
          />
          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full sm:w-auto px-8 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 text-base whitespace-nowrap"
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </button>
        </div>
        
        {error && (
          <div className="text-red-600 dark:text-red-400 text-center text-sm">
            {error}
          </div>
        )}
        
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm italic">
          No spam. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
} 