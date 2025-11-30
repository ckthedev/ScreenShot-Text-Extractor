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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-gray-200 bg-gray-50">
        <h3 className="text-md font-semibold text-gray-700">{title}</h3>
        <button
          onClick={handleCopy}
          disabled={!text}
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
      <div className="p-4">
        <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
          {text || <span className="text-gray-400">Not available.</span>}
        </p>
      </div>
    </div>
  );
};