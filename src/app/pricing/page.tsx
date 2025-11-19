import React from 'react';
import { Pricing } from "@/components/landing/Pricing";
import Footer from '@/components/landing/Footer';
import { Navbar } from "@/components/landing/Navbar";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-green-500/30">
            <Navbar />
            <main className="pt-20">
                <Pricing />
            </main>
            <Footer />
        </div>
    );
}
