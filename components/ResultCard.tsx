import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface ResultCardProps {
  title: string;
  text: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if(!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
        <button
          onClick={handleCopy}
          disabled={!text}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500"
        >
          {copied ? (
            <>
              <CheckIcon className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
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
      <div className="p-4">
        <p className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
          {text || <span className="text-gray-400 dark:text-gray-500">Not available.</span>}
        </p>
      </div>
    </div>
  );
};
