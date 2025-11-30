import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UploadIcon, UrlIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

type UploadMethod = 'upload' | 'url';

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<UploadMethod>('upload');
  
  // URL Method State
  const [imageUrl, setImageUrl] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [urlImagePreview, setUrlImagePreview] = useState<string | null>(null);
  const [fetchedFile, setFetchedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanupObjectUrls = useCallback(() => {
    if (urlImagePreview) URL.revokeObjectURL(urlImagePreview);
  }, [urlImagePreview]);

  useEffect(() => {
    return () => {
      cleanupObjectUrls();
    };
  }, [cleanupObjectUrls]);

  const validateFile = useCallback((file: File | null): boolean => {
    if (!file) return false;
    // For other files, we check against the supported list.
    if (!file.name.endsWith('.png') && !SUPPORTED_FORMATS.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or WEBP file.');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 10MB. Please upload a smaller image.');
      return false;
    }
    setError(null);
    return true;
  }, []);

  const handleFile = useCallback((file: File | null) => {
    if (validateFile(file)) {
      onImageUpload(file as File);
    }
  }, [onImageUpload, validateFile]);

  // --- Upload Method Handlers ---
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { handleFile(e.target.files?.[0]); };
  const onButtonClick = () => { fileInputRef.current?.click(); };


  // --- URL Method Handlers ---
  const handleUrlSubmit = useCallback(async () => {
    setError(null);
    if (!imageUrl) {
      setError('Please enter an image URL.');
      return;
    }
    try { new URL(imageUrl); } catch (_) { setError('Please enter a valid URL format.'); return; }

    setIsFetchingUrl(true);
    try {
      const proxies = ['https://corsproxy.io/?', 'https://api.allorigins.win/raw?url='];
      let response: Response | null = null;
      let lastError: Error | null = new Error('Could not fetch image. The URL may be invalid or the resource is protected.');

      for (const proxy of proxies) {
        try {
          const res = await fetch(`${proxy}${encodeURIComponent(imageUrl)}`);
          if (res.ok) { response = res; lastError = null; break; }
          if (res.status === 404) { lastError = new Error('Image not found at the specified URL (404).'); break; }
          if (res.status === 403) { lastError = new Error('Access to the image is forbidden (403). The resource may be private.'); break; }
          if (res.status >= 400 && res.status < 500) { lastError = new Error(`Client error fetching image: ${res.status}.`); break; }
          if (res.status >= 500) { lastError = new Error(`Server error: ${res.status}. Trying fallback...`); continue; }
        } catch (err) {
          lastError = new Error('A network error occurred. Check your connection and the URL.');
        }
      }
      if (lastError || !response) throw lastError;
      
      const blob = await response.blob();
      if (blob.size === 0) throw new Error('Fetched file is empty.');
      
      const getMimeTypeFromUrl = (url: string): string | undefined => {
        try {
          const path = new URL(url).pathname;
          const extension = path.substring(path.lastIndexOf('.')).toLowerCase();
          switch (extension) {
            case '.jpg': case '.jpeg': return 'image/jpeg';
            case '.png': return 'image/png';
            case '.webp': return 'image/webp';
            default: return undefined;
          }
        } catch { return undefined; }
      };
      
      const inferredMimeType = getMimeTypeFromUrl(imageUrl);
      if (!inferredMimeType) throw new Error('Could not determine image type from URL (e.g., .jpg, .png, .webp).');
      
      const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1).split('?')[0] || 'image-from-url.jpg';
      const file = new File([blob], fileName, { type: inferredMimeType });
      
      if (!validateFile(file)) return;
      
      setFetchedFile(file);
      cleanupObjectUrls();
      setUrlImagePreview(URL.createObjectURL(blob));
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred while fetching the image.');
    } finally {
      setIsFetchingUrl(false);
    }
  }, [imageUrl, validateFile, cleanupObjectUrls]);

  const handleProcessFetchedFile = () => { if (validateFile(fetchedFile)) onImageUpload(fetchedFile as File); };
  const handleCancelUrlPreview = () => { setUrlImagePreview(null); setFetchedFile(null); setImageUrl(''); setError(null); };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-md mx-auto mb-6">
          <div className="flex p-1 bg-gray-100 rounded-lg">
            {(['upload', 'url'] as UploadMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMethod(m); setError(null); }}
                className={`w-full py-2 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2 ${
                  method === m
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'upload' && <><UploadIcon className="w-4 h-4" /><span>Upload File</span></>}
                {m === 'url' && <><UrlIcon className="w-4 h-4" /><span>From URL</span></>}
              </button>
            ))}
          </div>
        </div>

      {method === 'upload' && (
        <div
          onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} onClick={onButtonClick}
          className={`w-full p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 animate-fade-in ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}`}>
          <input ref={fileInputRef} type="file" className="hidden" accept={SUPPORTED_FORMATS.join(',')} onChange={handleFileChange} />
          <div className="flex flex-col items-center text-center space-y-4">
            <UploadIcon className="w-12 h-12 text-gray-400" />
            <p className="text-lg font-medium text-gray-700"><span className="text-indigo-600">Click to upload</span> or drag and drop</p>
            <p className="text-sm text-gray-500">Supports: JPG, PNG, WEBP (Max 10MB)</p>
          </div>
        </div>
      )}
      
      {method === 'url' && (
        <div className="w-full animate-fade-in">
          {urlImagePreview && fetchedFile ? (
            <div className="text-center space-y-4">
              <p className="font-medium text-gray-700">Image Preview</p>
              <img src={urlImagePreview} alt="Preview from URL" className="max-h-48 mx-auto rounded-lg shadow-md border border-gray-200" />
              <div className="flex items-center justify-center gap-4 pt-2">
                <button onClick={handleCancelUrlPreview} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">Cancel</button>
                <button onClick={handleProcessFetchedFile} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Process Image</button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UrlIcon className="w-5 h-5 text-gray-400" /></div>
                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !isFetchingUrl) handleUrlSubmit(); }} placeholder="https://... Paste image URL here" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors" disabled={isFetchingUrl} />
              </div>
              <button onClick={handleUrlSubmit} disabled={isFetchingUrl || !imageUrl} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {isFetchingUrl ? ( <><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Fetching Image...</span></> ) : ( <span>Process from URL</span> )}
              </button>
            </>
          )}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
};