
import React from 'react';

export const Header: React.FC = () => (
  <header className="py-4 px-8 text-center border-b border-gray-700/50 shadow-lg bg-gray-900/70 backdrop-blur-sm">
    <h1 className="text-3xl md:text-4xl font-bold">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
        Gemini AI Image Stylist
      </span>
    </h1>
    <p className="text-gray-400 mt-1">Transform your images with the power of AI</p>
  </header>
);
