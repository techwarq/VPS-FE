'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const plans = [
    {
        name: 'Starter',
        price: '20',
        description: 'Perfect for hobbyists and early-stage brands starting their AI journey.',
        features: [
            '50 AI Photoshoots per month',
            'Basic Branding Tools',
            'Standard Virtual Studio',
            'Community Support',
            'Personal License'
        ],
        cta: 'Start Creating',
        popular: false,
        gradient: 'from-gray-800 to-gray-900'
    },
    {
        name: 'Pro',
        price: '200',
        description: 'For growing brands and agencies requiring professional-grade power.',
        features: [
            'Unlimited AI Photoshoots',
            'Advanced Virtual Studio',
            'Full Drop Planning Suite',
            'Priority 24/7 Support',
            'Commercial License',
            'Custom Model Training',
            'API Access'
        ],
        cta: 'Scale Your Brand',
        popular: true,
        gradient: 'from-emerald-900/40 to-black'
    }
];

export const Pricing = () => {
    return (
        <section className="py-32 relative overflow-hidden bg-black" id="pricing">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Choose the plan that best fits your growth stage. No hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-emerald-500/50 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]' : 'border-white/10'} bg-gray-900/40 backdrop-blur-xl flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-sm font-bold px-4 py-1 rounded-full flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                                    <span className="text-gray-400">/month</span>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="flex-grow mb-8">
                                <ul className="space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                                            <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-emerald-400' : 'text-gray-500'}`} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link href="/signup" className="w-full">
                                <Button
                                    className={`w-full py-6 text-lg rounded-xl transition-all duration-300 ${plan.popular
                                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)]'
                                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                                        }`}
                                >
                                    {plan.cta} <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
