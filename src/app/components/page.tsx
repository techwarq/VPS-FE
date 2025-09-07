import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Components() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            UI Components
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Reusable components built with TypeScript and Tailwind CSS
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card title="Buttons">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </div>
          </Card>

          <Card title="Cards">
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Card Example</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  This is an example of a card component with proper styling.
                </p>
              </div>
            </div>
          </Card>

          <Card title="Typography">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Heading 1</h1>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Heading 2</h2>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Heading 3</h3>
              <p className="text-gray-600 dark:text-gray-300">Regular paragraph text</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Small text</p>
            </div>
          </Card>

          <Card title="Colors">
            <div className="grid grid-cols-2 gap-2">
              <div className="h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs">Blue</div>
              <div className="h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs">Green</div>
              <div className="h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs">Red</div>
              <div className="h-8 bg-yellow-500 rounded flex items-center justify-center text-white text-xs">Yellow</div>
            </div>
          </Card>

          <Card title="Forms">
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea 
                placeholder="Enter your message"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </Card>

          <Card title="Alerts">
            <div className="space-y-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-sm">Info alert</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg">
                <p className="text-green-800 dark:text-green-200 text-sm">Success alert</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
                <p className="text-red-800 dark:text-red-200 text-sm">Error alert</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
