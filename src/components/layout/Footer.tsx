import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-green-500/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-400">
          <p className="mb-2">&copy; 2024 AI Image Studio. Built with Next.js, TypeScript, and Tailwind CSS.</p>
          <p className="text-sm text-gray-500">Powered by advanced AI technology for realistic avatar generation</p>
        </div>
      </div>
    </footer>
  );
};
