import React from 'react';
import { Card } from '@/components/ui/Card';
import { Wand2, Camera, Calendar, BarChart3 } from 'lucide-react';

const features = [
    {
        icon: <Wand2 className="w-8 h-8 text-purple-400" />,
        title: "AI Branding",
        description: "Instantly generate cohesive brand assets. From logos to mood boards, let AI define your visual identity.",
        image: "/Gemini_Generated_Image_5nmi595nmi595nmi.png"
    },
    {
        icon: <Camera className="w-8 h-8 text-green-400" />,
        title: "Virtual Studio",
        description: "Skip the expensive photoshoots. Generate professional model shots, try-ons, and editorials digitally.",
        image: "/Gemini_Generated_Image_8dbrwd8dbrwd8dbr.png"
    },
    {
        icon: <Calendar className="w-8 h-8 text-blue-400" />,
        title: "Drop Planning",
        description: "Orchestrate your releases with precision. Schedule content, manage inventory, and sync with your store.",
        image: "/Gemini_Generated_Image_63brcj63brcj63br.png"
    },
    {
        icon: <BarChart3 className="w-8 h-8 text-orange-400" />,
        title: "Market Insights",
        description: "Analyze trends and get AI-driven recommendations on what genres and styles will sell best.",
        image: "/Gemini_Generated_Image_pt8r7fpt8r7fpt8r.png"
    }
];

export const Features = () => {
    return (
        <section className="py-24 relative bg-black/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Everything You Need to <br />
                        <span className="text-green-400">Scale Your Brand</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Replace fragmented tools with one powerful AI platform designed for modern clothing companies.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            variant="default"
                            hover={true}
                            className="bg-gray-900/40 border-white/5 hover:border-green-500/30 transition-all duration-300 group overflow-hidden"
                        >
                            <div className="h-48 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10">
                                    {feature.icon}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
