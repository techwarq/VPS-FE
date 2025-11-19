import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Integrations } from "@/components/landing/Integrations";
import { Workflow } from "@/components/landing/Workflow";
import { Pricing } from "@/components/landing/Pricing";
import Footer from '@/components/landing/Footer';
import { Navbar } from "@/components/landing/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-green-500/30">

      <Navbar />

      <main className="pt-20">
        <Hero />
        <Features />
        <Workflow />
        <Integrations />


        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-green-900/10" />
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Ready to Revolutionize Your Drops?
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              Join hundreds of forward-thinking clothing brands using AI to scale faster.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-12 py-6 text-xl font-semibold rounded-full transition-all hover:scale-105">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

