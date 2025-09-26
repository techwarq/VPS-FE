import React from 'react';
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-400/10 rounded-full blur-2xl"></div>
      </div>
      
      {/* Elegant grid pattern */}
      <div className="absolute inset-0 opacity-2" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.1) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-6xl font-bangers text-white mb-6 tracking-wide animate-fade-in-up">
            Virtual Photoshoot
          </h1>
          <h2 className="text-2xl md:text-3xl font-bangers text-green-400/80 mb-8 tracking-wider animate-fade-in-up delay-200">
            AI-Powered Fashion Studio
          </h2>
          <p className="text-lg md:text-xl text-gray-300/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up delay-400">
            Create cutting-edge fashion photography and futuristic portraits with AI. 
            Generate diverse models, try on virtual outfits, and capture dynamic poses for the multiverse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-600 mb-16">
            <Link href="/generate">
              <Button variant="primary" size="lg" className="bg-green-600/90 hover:bg-green-500/90 text-white border-0 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-green-500/25">
                Start Photoshoot
              </Button>
            </Link>
            <Link href="/gallery">
              <Button variant="outline" size="lg" className="border-green-500/40 text-green-400 hover:bg-green-500/10 transition-all duration-300 hover:scale-105">
                View Portfolio
              </Button>
            </Link>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative inline-block rounded-2xl overflow-hidden shadow-2xl animate-float">
              <img 
                src="/Generated Image September 26, 2025 - 6_11PM.png" 
                alt="AI-Verse Magazine - Futuristic Fashion" 
                className="w-full max-w-4xl h-auto rounded-2xl transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bangers text-white mb-4 tracking-wide">
              Futuristic Fashion Studio
            </h2>
            <p className="text-gray-400/80 max-w-2xl mx-auto font-bangers">
              Cutting-edge tools for creating multiverse fashion photography
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 1. Pose - Using the character customization interface image */}
            <Card variant="default" hover={true} className="border-green-500/20 hover:border-green-500/40 transition-all duration-500 hover:scale-105 animate-fade-in-up delay-100 overflow-hidden">
              <div className="mb-4">
                <img 
                  src="/Gemini_Generated_Image_5nmi595nmi595nmi.png" 
                  alt="Character Customization Interface" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">✨ Pose</h3>
              <p className="text-gray-300/90 leading-relaxed font-light text-sm">
                Strike the perfect pose. Capture bold and stylish stances in a cinematic animated look.
            </p>
          </Card>

            {/* 2. Photoshoot with Accessories - Using the woman with floating accessories image */}
            <Card variant="default" hover={true} className="border-green-500/20 hover:border-green-500/40 transition-all duration-500 hover:scale-105 animate-fade-in-up delay-200 overflow-hidden">
              <div className="mb-4">
                <img 
                  src="/Gemini_Generated_Image_8dbrwd8dbrwd8dbr.png" 
                  alt="Photoshoot with Accessories" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">🕶️ Photoshoot with Accessories</h3>
              <p className="text-gray-300/90 leading-relaxed font-light text-sm">
                Style meets detail. Add sunglasses, jewelry, and more — accessories that define your virtual look.
            </p>
          </Card>

            {/* 3. Photoshoot with Try-On - Using the fashion store/dressing room image */}
            <Card variant="default" hover={true} className="border-green-500/20 hover:border-green-500/40 transition-all duration-500 hover:scale-105 animate-fade-in-up delay-300 overflow-hidden">
              <div className="mb-4">
                <img 
                  src="/Gemini_Generated_Image_63brcj63brcj63br.png" 
                  alt="Fashion Store Try-On" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">👗 Photoshoot with Try-On</h3>
              <p className="text-gray-300/90 leading-relaxed font-light text-sm">
                Try it, wear it, own it. Experiment with futuristic outfits and see your avatar styled in real time.
            </p>
          </Card>

            {/* 4. Avatar Creations - Using the futuristic character in trench coat image */}
            <Card variant="default" hover={true} className="border-green-500/20 hover:border-green-500/40 transition-all duration-500 hover:scale-105 animate-fade-in-up delay-400 overflow-hidden">
              <div className="mb-4">
                <img 
                  src="/Gemini_Generated_Image_pt8r7fpt8r7fpt8r.png" 
                  alt="Avatar Creations" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">🌐 Avatar Creations</h3>
              <p className="text-gray-300/90 leading-relaxed font-light text-sm">
                Your avatar, your identity. Create your unique digital persona — customized, futuristic, and truly yours.
            </p>
          </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-gray-900/40 via-black/30 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-green-500/20 p-12 shadow-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bangers text-white mb-4 tracking-wide">
              Ready to Create for the Multiverse?
            </h2>
            <p className="text-gray-400/80 max-w-2xl mx-auto font-bangers">
              Begin your journey into futuristic fashion photography with our AI-powered studio
            </p>
        </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center group">
              <div className="text-5xl mb-6 opacity-80">🌟</div>
              <h3 className="text-xl font-bangers text-white mb-4 tracking-wide">
                Create Fashion Editorial
              </h3>
              <p className="text-gray-300/80 mb-6 leading-relaxed font-bangers">
                Generate diverse models, try on futuristic outfits, and capture dynamic poses for your AI-Verse Magazine spread.
              </p>
              <Link href="/generate">
                <Button variant="primary" size="lg" className="w-full bg-green-600/90 hover:bg-green-500/90 text-white border-0">
                  Start Creating
                </Button>
              </Link>
            </div>
            
            <div className="text-center group">
              <div className="text-5xl mb-6 opacity-80">📱</div>
              <h3 className="text-xl font-bangers text-white mb-4 tracking-wide">
                View AI-Verse Gallery
              </h3>
              <p className="text-gray-300/80 mb-6 leading-relaxed font-bangers">
                Browse your collection of multiverse fashion photography and manage your digital magazine portfolio.
              </p>
              <Link href="/gallery">
                <Button variant="outline" size="lg" className="w-full border-green-500/40 text-green-400 hover:bg-green-500/10">
                  View Gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-3 text-gray-500/60 text-sm font-light">
            <div className="w-1 h-1 bg-green-500/60 rounded-full"></div>
            <span>Virtual Photoshoot Studio</span>
            <div className="w-1 h-1 bg-green-500/60 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
