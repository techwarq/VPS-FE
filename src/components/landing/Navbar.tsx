import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo3.png"
                            alt="AlloreAI Logo"
                            width={150}
                            height={50}
                            className="h-14 w-auto object-contain"
                            priority
                        />
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Use Cases
                        </Link>
                        <Link href="/pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Pricing
                        </Link>
                        <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Portfolio
                        </Link>
                        <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            About Us
                        </Link>
                        <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Contact Us
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/signin">
                            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/5">
                                Login
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button variant="primary" size="sm" className="bg-green-600 hover:bg-green-500 text-white border-0">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
