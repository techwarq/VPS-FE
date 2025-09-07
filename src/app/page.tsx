import React from 'react';
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-black matrix-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="text-8xl mb-4">🎨</div>
            <div className="w-32 h-1 bg-green-500 mx-auto mb-6 glow-green"></div>
          </div>
          <h1 className="text-6xl font-bold text-green-400 mb-6 glow-green">
            AI Image Studio
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Create stunning images with artificial intelligence. 
            Step-by-step workflow with advanced controls and instant results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate">
              <Button variant="primary" size="lg" className="glow-green-strong">
                🚀 Start Generating
              </Button>
            </Link>
            <Link href="/gallery">
              <Button variant="outline" size="lg">
                📸 View Gallery
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card title="🤖 AI-Powered" variant="glow">
            <p className="text-gray-300">
              Advanced AI models for high-quality image generation with multiple style options.
            </p>
          </Card>

          <Card title="⚡ Fast Generation" variant="glow">
            <p className="text-gray-300">
              Optimized for speed with real-time progress tracking and instant previews.
            </p>
          </Card>

          <Card title="🎨 Multiple Styles" variant="glow">
            <p className="text-gray-300">
              Choose from photorealistic, anime, oil painting, cyberpunk, and more artistic styles.
            </p>
          </Card>

          <Card title="💾 Smart Storage" variant="glow">
            <p className="text-gray-300">
              Automatic image storage with metadata, tags, and search functionality.
            </p>
          </Card>

          <Card title="🔧 Advanced Controls" variant="glow">
            <p className="text-gray-300">
              Fine-tune generation with quality settings, steps, seeds, and custom parameters.
            </p>
          </Card>

          <Card title="📱 Responsive Design" variant="glow">
            <p className="text-gray-300">
              Works perfectly on desktop, tablet, and mobile devices with touch-friendly interface.
            </p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900/50 rounded-2xl border border-green-500/30 p-8 glow-green">
          <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">
            Get Started
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-green-400 mb-4">
                Step-by-Step Generation
              </h3>
              <p className="text-gray-300 mb-4">
                Follow our guided workflow to create the perfect image with AI
              </p>
              <Link href="/generate">
                <Button variant="primary" className="w-full">
                  Start Creating
                </Button>
              </Link>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className="text-xl font-semibold text-green-400 mb-4">
                Browse Gallery
              </h3>
              <p className="text-gray-300 mb-4">
                View and manage all your generated images in one place
              </p>
              <Link href="/gallery">
                <Button variant="outline" className="w-full">
                  View Gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
