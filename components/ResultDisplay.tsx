import React from 'react';
import { PhotoIcon } from './icons/PhotoIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultDisplayProps {
  editedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
  <div className="w-full h-full bg-gray-700 rounded-lg animate-pulse flex flex-col items-center justify-center p-4">
    <div className="w-16 h-16 text-gray-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="animate-spin">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691V5.25a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75" />
        </svg>
    </div>
    <p className="text-gray-400 font-semibold">AI is working its magic...</p>
    <p className="text-xs text-gray-500 mt-1">This may take a moment.</p>
  </div>
);

const Placeholder: React.FC = () => (
    <div className="w-full h-full bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center p-4">
        <PhotoIcon className="w-16 h-16 text-gray-600 mb-4" />
        <p className="text-gray-500 font-semibold text-center">Your generated image will appear here</p>
    </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ editedImage, isLoading, error }) => {
    
  const handleDownload = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    // Provide a unique filename for the download
    link.download = `gemini-stylist-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-amber-400 mb-3">3. View Result</h2>
      <div className="relative aspect-square w-full">
        {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/20 border-2 border-red-500 rounded-lg p-4 text-center">
                <p className="font-semibold text-red-400">An Error Occurred</p>
                <p className="text-sm text-red-300 mt-1">{error}</p>
            </div>
        )}
        {!error && isLoading && <div className="absolute inset-0"><LoadingSkeleton /></div>}
        {!error && !isLoading && !editedImage && <Placeholder />}
        {!error && !isLoading && editedImage && (
            <>
                <div className="w-full h-full rounded-lg overflow-hidden border-2 border-amber-400 shadow-lg">
                    <img src={editedImage} alt="Edited result" className="w-full h-full object-contain" />
                </div>
                <button
                    onClick={handleDownload}
                    className="absolute bottom-4 right-4 bg-gray-900/70 text-white py-2 px-4 rounded-lg backdrop-blur-sm border border-gray-600 hover:bg-amber-500 hover:text-black transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
                    aria-label="Download edited image"
                    >
                    <DownloadIcon className="w-5 h-5" />
                    <span>Download</span>
                </button>
            </>
        )}
      </div>
    </div>
  );
};