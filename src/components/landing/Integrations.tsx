import React from 'react';
import { ArrowRightLeft } from 'lucide-react';

const integrations = [
    { name: 'Shopify', logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg' },
    { name: 'Instagram', logo: 'https://cdn.worldvectorlogo.com/logos/instagram-2016-5.svg' },
    { name: 'Amazon', logo: 'https://cdn.worldvectorlogo.com/logos/amazon-icon-1.svg' },
    { name: 'WooCommerce', logo: 'https://cdn.worldvectorlogo.com/logos/woocommerce.svg' },
];

export const Integrations = () => {
    return (
        <section className="py-32 relative overflow-hidden bg-black">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Seamlessly Connected
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Push your AI-generated campaigns directly to your sales channels and social media.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24">
                    {/* Central Hub */}
                    <div className="relative group shrink-0">
                        <div className="absolute inset-0 bg-green-500/20 rounded-3xl blur-2xl group-hover:bg-green-500/30 transition-all duration-500" />
                        <div className="w-32 h-32 bg-gray-900 border border-green-500/30 rounded-3xl flex items-center justify-center relative z-10 shadow-2xl shadow-green-500/10 overflow-hidden">
                            <img
                                src="/draw-logo.png"
                                alt="AlloreAI Logo"
                                className="w-24 h-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* Connection Lines (Desktop) */}
                    <div className="hidden lg:flex items-center gap-4 text-gray-700">
                        <ArrowRightLeft className="w-8 h-8 animate-pulse" />
                        <ArrowRightLeft className="w-8 h-8 animate-pulse delay-100" />
                        <ArrowRightLeft className="w-8 h-8 animate-pulse delay-200" />
                    </div>

                    {/* Partners Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
                        {integrations.map((platform, index) => (
                            <div
                                key={index}
                                className="group flex flex-col items-center justify-center gap-6 p-8 rounded-3xl bg-gray-900/50 border border-white/5 hover:bg-gray-800/50 hover:border-green-500/20 transition-all duration-500 hover:-translate-y-2 cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-transparent transition-all duration-500" />

                                <div className="w-16 h-16 flex items-center justify-center relative z-10 grayscale group-hover:grayscale-0 transition-all duration-500 opacity-70 group-hover:opacity-100">
                                    <img
                                        src={platform.logo}
                                        alt={platform.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <span className="text-base font-medium text-gray-500 group-hover:text-white transition-colors duration-300 relative z-10">{platform.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
