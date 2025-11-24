
import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Spinner } from './components/Spinner';
import { extractTextAndProcess } from './services/geminiService';
import type { ProcessedTextResult } from './types';
import { ThemeToggle } from './components/ThemeToggle';
import { AboutPage } from './components/AboutPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { BlogPage } from './components/BlogPage';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessedTextResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [page, setPage] = useState<'main' | 'about' | 'privacy' | 'blog'>('main');
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as 'light' | 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const navigateTo = (p: 'main' | 'about' | 'privacy' | 'blog') => {
    setPage(p);
    window.scrollTo(0, 0); // Scroll to top on page change
  };


  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setImagePreview(URL.createObjectURL(file));

    try {
      const processedResult = await extractTextAndProcess(file);
      setResult(processedResult);
    } catch (err: any) {
      console.error(err);
      // Use the specific error message from the service if available
      setError(
        err.message || 'Failed to process the image. Please try again with a clearer image.'
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

  const renderPage = () => {
    switch (page) {
      case 'about':
        return <AboutPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'blog':
        return <BlogPage />;
      case 'main':
      default:
        return (
          <>
            <header className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-gray-100 tracking-tight transition-colors duration-300">
                Screenshot Text Extractor
              </h1>
              <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
                Upload an image to extract, fix grammar, summarize, and translate text instantly.
              </p>
            </header>
            
            <main className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              {!result && !isLoading && (
                <ImageUploader onImageUpload={handleImageUpload} />
              )}

              {isLoading && (
                <div className="flex flex-col items-center justify-center space-y-6 min-h-[300px]">
                  {imagePreview && (
                    <img src={imagePreview} alt="Uploaded preview" className="max-h-48 rounded-lg shadow-md" />
                  )}
                  <Spinner />
                  <p className="text-gray-600 dark:text-gray-400 text-lg animate-pulse">Analyzing your image...</p>
                </div>
              )}

              {error && (
                <div className="text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
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
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="fixed top-4 right-4 z-50">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
      <div className="w-full max-w-4xl mx-auto">
        {renderPage()}
        
        <footer className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
           <div className="flex justify-center items-center space-x-4 mb-4">
            <button onClick={() => navigateTo('main')} className="hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-sm">Home</button>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <button onClick={() => navigateTo('about')} className="hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-sm">About Us</button>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <button onClick={() => navigateTo('blog')} className="hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-sm">Blog</button>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <button onClick={() => navigateTo('privacy')} className="hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-sm">Privacy Policy</button>
          </div>
          <p>Powered by Gemini AI. Built with React & Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
