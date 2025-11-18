import React, { useState, useCallback } from 'react';
import type { ProcessedTextResult, Translations } from '../types';
import { LanguageMap } from '../types';
import { ResultCard } from './ResultCard';
import { DownloadIcon, RedoIcon } from './Icons';
import { TranslationTabs } from './TranslationTabs';

interface ResultsDisplayProps {
  result: ProcessedTextResult;
  onReset: () => void;
  imagePreview: string | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset, imagePreview }) => {

  const generateTxtContent = useCallback(() => {
    let content = `--- EXTRACTED TEXT ---\n${result.extracted_text}\n\n`;
    content += `--- CORRECTED TEXT ---\n${result.cleaned_text}\n\n`;
    content += `--- SUMMARY ---\n${result.summary}\n\n`;
    content += `--- TRANSLATIONS ---\n`;
    Object.entries(result.translations).forEach(([lang, text]) => {
      content += `\n[${lang.toUpperCase()}]\n${text}\n`;
    });
    return content;
  }, [result]);

  const handleDownload = useCallback(() => {
    const content = generateTxtContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generateTxtContent]);


  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Processing Complete</h2>
        <div className="flex items-center gap-2">
           <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            <DownloadIcon className="w-4 h-4" />
            Download (.txt)
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors text-sm font-medium"
          >
            <RedoIcon className="w-4 h-4" />
            Process Another
          </button>
        </div>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
                 {imagePreview && (
                    <div className="sticky top-8">
                        <img src={imagePreview} alt="Processed screenshot" className="w-full h-auto object-contain rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"/>
                        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">Original Image</p>
                    </div>
                 )}
            </div>
            <div className="md:col-span-2 space-y-6">
                <ResultCard title="Extracted Text" text={result.extracted_text} />
                <ResultCard title="Corrected & Rewritten" text={result.cleaned_text} />
                <ResultCard title="Summary" text={result.summary} />
                <TranslationTabs translations={result.translations} />
            </div>
        </div>
    </div>
  );
};
