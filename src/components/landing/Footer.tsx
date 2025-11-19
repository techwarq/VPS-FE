import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Linkedin, Github, Disc, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-20 pb-10 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between gap-16 mb-20">
                    {/* Left Section: Logo & CTA */}
                    <div className="max-w-md">
                        <div className="mb-12">
                            <Image
                                src="/logo3.png"
                                alt="AlloreAI Logo"
                                width={40}
                                height={40}
                                className="w-10 h-auto"
                            />
                        </div>

                        <h2 className="text-5xl md:text-6xl font-serif mb-8">Stay updated.</h2>

                        <Button
                            className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg font-medium rounded-none"
                        >
                            JOIN DISCORD
                        </Button>
                    </div>

                    {/* Right Section: Links */}
                    <div className="grid grid-cols-2 gap-12 lg:gap-24">
                        {/* Product Column */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-gray-500 text-sm font-semibold tracking-wider mb-2">PRODUCT</h3>
                            <Link href="/generation" className="hover:text-emerald-400 transition-colors">Virtual Studio</Link>
                            <Link href="/generation" className="hover:text-emerald-400 transition-colors">AI Branding</Link>
                            <Link href="/generation" className="hover:text-emerald-400 transition-colors">Drop Planning</Link>
                        </div>

                        {/* Company Column */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-gray-500 text-sm font-semibold tracking-wider mb-2">COMPANY</h3>
                            <Link href="#" className="hover:text-emerald-400 transition-colors">Support</Link>
                            <Link href="#" className="hover:text-emerald-400 transition-colors">Terms</Link>
                            <Link href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Socials & Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-900/50">
                    <div className="flex gap-6 mb-4 md:mb-0">
                        <Link href="#" className="text-gray-500 hover:text-white transition-colors">
                            <Twitter size={20} />
                        </Link>
                        <Link href="#" className="text-gray-500 hover:text-white transition-colors">
                            <Linkedin size={20} />
                        </Link>
                        <Link href="#" className="text-gray-500 hover:text-white transition-colors">
                            <Github size={20} />
                        </Link>
                        <Link href="#" className="text-gray-500 hover:text-white transition-colors">
                            <Disc size={20} />
                        </Link>
                        <Link href="#" className="text-gray-500 hover:text-white transition-colors">
                            <Youtube size={20} />
                        </Link>
                    </div>

                    <div className="text-gray-500 text-sm">
                        © AlloreAI 2025
                    </div>
                </div>
            </div>

            {/* Large Background Text */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none select-none opacity-10">
                <h1 className="text-[15vw] font-bold text-transparent leading-none text-center whitespace-nowrap"
                    style={{ WebkitTextStroke: '2px white' }}>
                    AlloreAI
                </h1>
            </div>
        </footer>
    );
};

export default Footer;
