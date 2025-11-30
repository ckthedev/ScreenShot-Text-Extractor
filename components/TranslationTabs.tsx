import React, { useState, useCallback } from 'react';
import type { Translations } from '../types';
import { LanguageMap } from '../types';
import { CopyIcon, CheckIcon, CopyAllIcon } from './Icons';

interface TranslationTabsProps {
  translations: Translations;
}

type LanguageKey = keyof Translations;

export const TranslationTabs: React.FC<TranslationTabsProps> = ({ translations }) => {
  const [activeTab, setActiveTab] = useState<LanguageKey>('English');
  const [copied, setCopied] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopy = useCallback(() => {
    const textToCopy = translations[activeTab];
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [activeTab, translations]);

  const handleCopyAll = useCallback(() => {
    const allTranslationsText = (Object.keys(LanguageMap) as LanguageKey[])
      .filter(lang => translations[lang]) // Only include non-empty translations
      .map(lang => `[${LanguageMap[lang].toUpperCase()}]\n${translations[lang]}`)
      .join('\n\n');
    
    if (!allTranslationsText) return;

    navigator.clipboard.writeText(allTranslationsText).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  }, [translations]);

  const noTranslationsAvailable = Object.values(translations).every(t => !t);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-gray-200 bg-gray-50">
            <h3 className="text-md font-semibold text-gray-700">Translations</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAll}
                disabled={noTranslationsAvailable}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {copiedAll ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5 text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyAllIcon className="w-3.5 h-3.5" />
                    <span>Copy All</span>
                  </>
                )}
              </button>
              <button
                onClick={handleCopy}
                disabled={!translations[activeTab]}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {copied ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5 text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
        </div>
        <div className="border-b border-gray-200 px-4">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {(Object.keys(LanguageMap) as LanguageKey[]).map((lang) => (
                <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === lang
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                {LanguageMap[lang]}
                </button>
            ))}
            </nav>
        </div>
        <div className="p-4">
            <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
            {translations[activeTab] || <span className="text-gray-400">Not available.</span>}
            </p>
        </div>
    </div>
  );
};