
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { ClearIcon } from './icons/ClearIcon';

interface PromptControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  onClear: () => void;
  isLoading: boolean;
  isReady: boolean;
}

export const PromptControls: React.FC<PromptControlsProps> = ({ prompt, setPrompt, onGenerate, onClear, isLoading, isReady }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-amber-400 mb-3">2. Describe Your Edit</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., Change the background to a futuristic city at night..."
        className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow resize-none placeholder-gray-500"
        disabled={!isReady}
      />
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button
          onClick={onGenerate}
          disabled={!isReady || isLoading || !prompt.trim()}
          className="flex-grow inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Generate
            </>
          )}
        </button>
         <button
          onClick={onClear}
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-colors"
        >
            <ClearIcon className="w-5 h-5 mr-2"/>
            Start Over
        </button>
      </div>
    </div>
  );
};
