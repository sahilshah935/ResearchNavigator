import React from 'react';
import { Search } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <h1 className="text-6xl font-bold text-green-600 dark:text-green-400 mb-12">
        ResearchNavigator
      </h1>
      <div className="w-full max-w-md">
        <a
          href="/login"
          className="block w-full text-center bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition-colors mb-4"
        >
          Login
        </a>
        <a
          href="/signup"
          className="block w-full text-center border-2 border-green-600 text-green-600 dark:text-green-400 px-6 py-3 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
        >
          Sign Up
        </a>
      </div>
    </div>
  );
}