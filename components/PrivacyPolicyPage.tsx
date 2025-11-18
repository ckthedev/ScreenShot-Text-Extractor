import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="animate-fade-in bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="prose prose-lg max-w-none text-gray-700 dark:prose-invert prose-headings:font-bold prose-headings:text-gray-800 prose-a:text-indigo-600 hover:prose-a:text-indigo-500 dark:prose-headings:text-gray-100 dark:prose-a:text-indigo-400">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: [Date]</p>
        
        <p>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our Screenshot Text Extractor tool.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p>
          The only data we actively process is the image file you choose to upload.
        </p>
        <ul>
          <li><strong>Uploaded Images:</strong> We collect the image you upload solely for the purpose of processing it.</li>
          <li><strong>No Personal Data:</strong> We do not require you to create an account, and we do not collect any personal information like your name, email address, or IP address.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p>
          The image you upload is used exclusively to provide the services of this tool:
        </p>
        <ul>
          <li>The image is sent to the Google Gemini API for text extraction and processing.</li>
          <li>The content of the image is used to generate the extracted text, corrected text, summary, and translations.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Storage and Security</h2>
        <p>
          <strong>We do not store your images.</strong> The uploaded image is processed in-memory and sent to the AI model. It is not saved on our servers or any database. Once your request is complete and the results are displayed, the image is discarded. We are committed to ensuring your data is handled securely and ephemerally.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Services</h2>
        <p>
          This service relies on the Google Gemini API to function. When you upload an image, it is sent to Google for processing. We recommend you review <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a> to understand how they handle data.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, you can contact us at <a href="mailto:privacy@example.com">privacy@example.com</a>.
        </p>
      </div>
    </div>
  );
};