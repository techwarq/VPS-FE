import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About This Project
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            A modern Next.js application with TypeScript and Tailwind CSS
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card title="Technologies Used">
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Next.js 15.5.2</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS v4</li>
              <li>• React 19</li>
              <li>• ESLint</li>
            </ul>
          </Card>

          <Card title="Features">
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• App Router</li>
              <li>• Server Components</li>
              <li>• Dark Mode Support</li>
              <li>• Responsive Design</li>
              <li>• Type Safety</li>
            </ul>
          </Card>
        </div>

        <div className="text-center">
          <Button variant="primary" size="lg">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
