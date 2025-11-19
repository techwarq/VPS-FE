"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const TypewriterEffect = ({ words }: { words: string[] }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(word.substring(0, currentText.length + 1));
        if (currentText.length === word.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setCurrentText(word.substring(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
      {currentText}
      <span className="animate-pulse text-white">|</span>
    </span>
  );
};

export const Hero = () => {
  return (
    <div className="relative overflow-hidden pt-20 pb-32">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-gray-900/0 to-gray-900/0" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-300">AI-Powered Fashion Drops</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight animate-fade-in-up delay-100 min-h-[160px] md:min-h-[200px]">
          The All-in-One Platform to <br />
          <TypewriterEffect
            words={["Do Photoshoots", "Try-ons", "Market Research", "Plan Drops", "Design Branding"]}
          />
        </h1>

        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          The all-in-one AI platform for clothing brands. Plan your strategy, generate stunning visuals, and launch directly to your store.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
          <Link href="/signup">
            <Button
              variant="primary"
              size="lg"
              className="bg-green-600 hover:bg-green-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 group"
            >
              Start Your Next Drop
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button
              variant="outline"
              size="lg"
              className="border-white/10 text-white hover:bg-white/5 px-8 py-6 text-lg rounded-xl backdrop-blur-sm transition-all duration-300"
            >
              View Demo
            </Button>
          </Link>
        </div>

        {/* Dashboard Preview / Hero Image Placeholder */}
        <div className="mt-20 relative mx-auto max-w-5xl animate-fade-in-up delay-500">
          <div className="relative rounded-2xl border border-white/10 bg-gray-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
            <img
              src="/Generated Image September 26, 2025 - 6_11PM.png"
              alt="Platform Dashboard"
              className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity duration-700"
            />
          </div>
          {/* Floating UI Elements for "B2B" feel */}
          <div className="absolute -right-12 top-1/4 bg-gray-800/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl hidden md:block animate-float">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-xl">🚀</span>
              </div>
              <div>
                <p className="text-xs text-gray-400">Drop Status</p>
                <p className="text-sm font-semibold text-white">Ready to Launch</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
