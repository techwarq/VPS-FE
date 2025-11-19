import React from 'react';
import { Lightbulb, Target, Rocket, CheckCircle2 } from 'lucide-react';

const steps = [
    {
        icon: <Lightbulb className="w-6 h-6 text-yellow-400" />,
        title: "Strategy & Insights",
        description: "Our AI analyzes global fashion trends to identify high-performing genres and styles tailored to your brand's niche."
    },
    {
        icon: <Target className="w-6 h-6 text-red-400" />,
        title: "Smart Planning",
        description: "Generate data-backed marketing tactics. We help you decide what to drop, when to drop it, and who to target."
    },
    {
        icon: <Rocket className="w-6 h-6 text-blue-400" />,
        title: "AI Creation & Launch",
        description: "Create magazine-quality editorials and product shots instantly. Integrate with your store and go live in minutes."
    }
];

export const Workflow = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-gray-900/50 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        From Concept to Sold Out
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        A streamlined workflow powered by intelligence at every step.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-green-500/0 via-green-500/50 to-green-500/0 md:-translate-x-1/2" />

                    <div className="space-y-12 md:space-y-24">
                        {steps.map((step, index) => (
                            <div key={index} className={`relative flex flex-col md:flex-row gap-8 items-start md:items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Content Side */}
                                <div className="flex-1 pl-20 md:pl-0 md:text-right">
                                    <div className={`md:max-w-md ${index % 2 === 0 ? 'md:ml-0 md:mr-auto md:text-left' : 'md:ml-auto md:mr-0'}`}>
                                        <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3 md:justify-end">
                                            {index % 2 === 0 && <span className="md:hidden">{step.icon}</span>}
                                            {step.title}
                                            {index % 2 !== 0 && <span className="hidden md:inline-flex">{step.icon}</span>}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Center Marker */}
                                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 border-2 border-green-500 rounded-full z-10 shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
                                </div>

                                {/* Empty Side for Balance */}
                                <div className="flex-1 hidden md:block" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
