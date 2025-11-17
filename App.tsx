
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Spinner } from './components/Spinner';
import { extractTextAndProcess } from './services/geminiService';
import type { ProcessedTextResult } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessedTextResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setImagePreview(URL.createObjectURL(file));

    try {
      const processedResult = await extractTextAndProcess(file);
      setResult(processedResult);
    } catch (err) {
      console.error(err);
      setError(
        'Failed to process the image. Please try again with a clearer image.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setResult(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  }, [imagePreview]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
            Screenshot Text Extractor
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Upload an image to extract, fix grammar, summarize, and translate text instantly.
          </p>
        </header>
        
        <main className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200">
          {!result && !isLoading && (
            <ImageUploader onImageUpload={handleImageUpload} />
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-6 min-h-[300px]">
               {imagePreview && (
                <img src={imagePreview} alt="Uploaded preview" className="max-h-48 rounded-lg shadow-md" />
              )}
              <Spinner />
              <p className="text-gray-600 text-lg animate-pulse">Analyzing your image...</p>
            </div>
          )}

          {error && (
            <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
              <p className="font-semibold">An Error Occurred</p>
              <p>{error}</p>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {result && (
            <ResultsDisplay result={result} onReset={handleReset} imagePreview={imagePreview} />
          )}
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Gemini AI. Built with React & Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
