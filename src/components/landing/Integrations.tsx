'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const integrations = [
    { name: 'Shopify', logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg', color: '#96bf48' },
    { name: 'Instagram', logo: 'https://cdn.worldvectorlogo.com/logos/instagram-2016-5.svg', color: '#E1306C' },
    { name: 'Amazon', logo: 'https://cdn.worldvectorlogo.com/logos/amazon-icon-1.svg', color: '#FF9900' },
    { name: 'WooCommerce', logo: 'https://cdn.worldvectorlogo.com/logos/woocommerce.svg', color: '#96588a' },
];

export const Integrations = () => {
    return (
        <section className="py-32 relative overflow-hidden bg-black">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Seamlessly Connected
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Push your AI-generated campaigns directly to your sales channels and social media.
                    </p>
                </div>

                <div className="relative flex flex-col items-center justify-center">
                    {/* Desktop View: Hub and Spoke */}
                    <div className="hidden lg:flex items-center justify-center gap-20 w-full">
                        {/* Central Hub */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative z-20"
                        >
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
                            <div className="w-40 h-40 bg-gray-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_50px_-12px_rgba(16,185,129,0.25)]">
                                <Image
                                    src="/draw-logo.png"
                                    alt="AlloreAI Logo"
                                    width={80}
                                    height={80}
                                    className="w-20 h-auto object-contain"
                                />
                            </div>
                        </motion.div>

                        {/* Connection Beams */}
                        <div className="flex items-center gap-4">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.2, duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                                    className="w-3 h-3 rounded-full bg-emerald-500/50 blur-[1px]"
                                />
                            ))}
                            <div className="h-[2px] w-32 bg-gradient-to-r from-emerald-500/50 to-transparent" />
                        </div>

                        {/* Partners Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            {integrations.map((platform, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 + 0.5 }}
                                    whileHover={{ scale: 1.05, borderColor: platform.color }}
                                    className="group relative w-48 h-40 bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                                    <div className="relative z-10 w-12 h-12 grayscale group-hover:grayscale-0 transition-all duration-300">
                                        <img
                                            src={platform.logo}
                                            alt={platform.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 group-hover:text-white transition-colors duration-300">
                                        {platform.name}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile View: Stacked */}
                    <div className="flex lg:hidden flex-col items-center gap-12 w-full">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-xl" />
                            <div className="w-24 h-24 bg-gray-900 border border-emerald-500/30 rounded-2xl flex items-center justify-center relative z-10">
                                <Image
                                    src="/draw-logo.png"
                                    alt="AlloreAI Logo"
                                    width={50}
                                    height={50}
                                    className="w-14 h-auto object-contain"
                                />
                            </div>
                        </div>

                        <div className="h-16 w-[2px] bg-gradient-to-b from-emerald-500/50 to-transparent" />

                        <div className="grid grid-cols-2 gap-4 w-full">
                            {integrations.map((platform, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-900/40 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center gap-3"
                                >
                                    <img
                                        src={platform.logo}
                                        alt={platform.name}
                                        className="w-10 h-10 object-contain grayscale opacity-70"
                                    />
                                    <span className="text-xs font-medium text-gray-500">{platform.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
