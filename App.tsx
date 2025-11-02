import React, { useState, useCallback } from 'react';
import { editImageWithPrompt } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { ImageUploader } from './components/ImageUploader';
import { PromptControls } from './components/PromptControls';
import { ResultDisplay } from './components/ResultDisplay';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import type { ImageFile } from './types';

const App: React.FC = () => {
  const [originalImages, setOriginalImages] = useState<ImageFile[]>([]);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (files: FileList) => {
    setError(null);
    setEditedImage(null);
    try {
      const filePromises = Array.from(files).map(file => 
        fileToBase64(file).then(({ base64Data, mimeType }) => ({
          name: file.name,
          dataUrl: `data:${mimeType};base64,${base64Data}`,
          base64Data,
          mimeType,
        }))
      );
      
      const loadedImages = await Promise.all(filePromises);
      setOriginalImages(prevImages => [...prevImages, ...loadedImages]);
    } catch (err) {
      setError('Failed to load one or more images. Please ensure they are valid image files.');
      console.error(err);
    }
  }, []);

  const handleRemoveImage = useCallback((indexToRemove: number) => {
    setOriginalImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (originalImages.length === 0 || !prompt.trim()) {
      setError('Please upload at least one image and enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const imageData = originalImages.map(img => ({
          base64Data: img.base64Data,
          mimeType: img.mimeType
      }));
      const newImageBase64 = await editImageWithPrompt(
        imageData,
        prompt
      );
      setEditedImage(`data:image/png;base64,${newImageBase64}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate image: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [originalImages, prompt]);

  const handleClear = useCallback(() => {
    setOriginalImages([]);
    setEditedImage(null);
    setPrompt('');
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-6xl bg-gray-800/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
            <div className="flex flex-col gap-6">
              <ImageUploader 
                onImageUpload={handleImageUpload} 
                originalImages={originalImages}
                onRemoveImage={handleRemoveImage}
              />
              <PromptControls
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleGenerate}
                onClear={handleClear}
                isLoading={isLoading}
                isReady={originalImages.length > 0}
              />
            </div>
            <div className="md:border-l md:border-gray-700 md:pl-8">
               <ResultDisplay 
                editedImage={editedImage} 
                isLoading={isLoading} 
                error={error} 
               />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
