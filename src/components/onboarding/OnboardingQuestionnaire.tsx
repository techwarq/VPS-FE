'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, ArrowRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type UserType = 'hobby' | 'company' | null;

interface OnboardingData {
    userType: UserType;
    name: string;
    role: string;
    goal: string;
    helpNeeded: string;
    companySize: string;
    industry: string;
    useCase: string;
}

const initialData: OnboardingData = {
    userType: null,
    name: '',
    role: '',
    goal: '',
    helpNeeded: '',
    companySize: '',
    industry: '',
    useCase: '',
};

export const OnboardingQuestionnaire = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState(0);
    const [data, setData] = useState<OnboardingData>(initialData);

    useEffect(() => {
        const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
        if (!hasCompletedOnboarding) {
            setIsVisible(true);
        }
    }, []);

    const handleComplete = () => {
        localStorage.setItem('onboarding_completed', 'true');
        setIsVisible(false);
        // Here you would typically send the data to your backend
        console.log('Onboarding completed:', data);
    };

    const handleNext = () => {
        setStep((prev) => prev + 1);
    };

    const updateData = (key: keyof OnboardingData, value: string) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    if (!isVisible) return null;

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-white text-center mb-2">Welcome! Tell us about yourself</h2>
                        <p className="text-gray-400 text-center mb-8">This helps us tailor your experience.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => {
                                    updateData('userType', 'hobby');
                                    handleNext();
                                }}
                                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-300 text-left"
                            >
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <User className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Hobby User</h3>
                                <p className="text-sm text-gray-400">I'm exploring for personal projects and fun.</p>
                            </button>

                            <button
                                onClick={() => {
                                    updateData('userType', 'company');
                                    handleNext();
                                }}
                                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-300 text-left"
                            >
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Building2 className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Company / Enterprise</h3>
                                <p className="text-sm text-gray-400">I'm looking to scale my brand and business.</p>
                            </button>
                        </div>
                    </div>
                );

            case 1:
                if (data.userType === 'hobby') {
                    return (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-6">A bit more about you</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">What's your name?</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => updateData('name', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">What do you do?</label>
                                    <input
                                        type="text"
                                        value={data.role}
                                        onChange={(e) => updateData('role', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        placeholder="e.g. Designer, Student, Developer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">What do you want to achieve with us?</label>
                                    <textarea
                                        value={data.goal}
                                        onChange={(e) => updateData('goal', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors h-24 resize-none"
                                        placeholder="Tell us about your goals..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">How can we help? (Optional)</label>
                                    <textarea
                                        value={data.helpNeeded}
                                        onChange={(e) => updateData('helpNeeded', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors h-24 resize-none"
                                        placeholder="Any specific features you're looking for?"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <Button variant="ghost" onClick={handleComplete} className="text-gray-400 hover:text-white">
                                    Skip
                                </Button>
                                <Button
                                    onClick={handleComplete}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8"
                                    disabled={!data.name}
                                >
                                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    );
                } else {
                    // Company Flow Step 1
                    return (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Tell us about your company</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Company Size</label>
                                    <select
                                        value={data.companySize}
                                        onChange={(e) => updateData('companySize', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                    >
                                        <option value="" disabled>Select size</option>
                                        <option value="1-10" className="bg-gray-900">1-10 employees</option>
                                        <option value="11-50" className="bg-gray-900">11-50 employees</option>
                                        <option value="51-200" className="bg-gray-900">51-200 employees</option>
                                        <option value="201+" className="bg-gray-900">201+ employees</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Industry</label>
                                    <select
                                        value={data.industry}
                                        onChange={(e) => updateData('industry', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                    >
                                        <option value="" disabled>Select industry</option>
                                        <option value="fashion" className="bg-gray-900">Fashion & Apparel</option>
                                        <option value="retail" className="bg-gray-900">Retail</option>
                                        <option value="marketing" className="bg-gray-900">Marketing & Agency</option>
                                        <option value="tech" className="bg-gray-900">Technology</option>
                                        <option value="other" className="bg-gray-900">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Primary Use Case</label>
                                    <select
                                        value={data.useCase}
                                        onChange={(e) => updateData('useCase', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                    >
                                        <option value="" disabled>Select use case</option>
                                        <option value="virtual-photoshoots" className="bg-gray-900">Virtual Photoshoots</option>
                                        <option value="design-iteration" className="bg-gray-900">Design Iteration</option>
                                        <option value="marketing-assets" className="bg-gray-900">Marketing Assets</option>
                                        <option value="catalog-generation" className="bg-gray-900">Catalog Generation</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end mt-8">
                                <Button
                                    onClick={handleNext}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-8"
                                    disabled={!data.companySize || !data.industry}
                                >
                                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    );
                }

            case 2:
                // Company Flow Final Step
                return (
                    <div className="space-y-8 text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-blue-400" />
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-4">How would you like to proceed?</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Based on your needs, we can offer a personalized demo or you can explore the platform on your own.
                        </p>

                        <div className="grid gap-4">
                            <button
                                onClick={() => {
                                    // Logic for booking a meeting could go here
                                    handleComplete();
                                }}
                                className="w-full p-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all flex items-center justify-center gap-2"
                            >
                                Let's have a meeting
                            </button>

                            <button
                                onClick={handleComplete}
                                className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
                            >
                                Take a tour of the platform
                            </button>

                            <button
                                onClick={handleComplete}
                                className="text-gray-500 hover:text-gray-300 text-sm mt-2"
                            >
                                Just let me explore the website
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative"
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                    <motion.div
                        className={`h-full ${data.userType === 'company' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                        initial={{ width: '0%' }}
                        animate={{ width: `${((step + 1) / (data.userType === 'company' ? 3 : 2)) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};
