import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="prose prose-lg max-w-none text-gray-700 dark:prose-invert prose-headings:font-bold prose-headings:text-gray-800 prose-a:text-indigo-600 hover:prose-a:text-indigo-500 dark:prose-headings:text-gray-100 dark:prose-a:text-indigo-400">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p>
          Our mission is to make information accessible and useful, regardless of its format. We believe that valuable knowledge is often locked away in images and screenshots. This tool was built to instantly unlock that knowledge, making it easy to extract, refine, and repurpose text for students, professionals, and anyone in between.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">The Technology</h2>
        <p>
          This application is powered by Google's state-of-the-art Gemini AI model. We leverage its powerful multimodal capabilities to perform several complex tasks in a single, streamlined process:
        </p>
        <ul>
          <li><strong>Optical Character Recognition (OCR):</strong> Accurately extracts text from any image you provide.</li>
          <li><strong>Text Correction:</strong> Automatically corrects spelling and grammatical errors to produce clean, professional text.</li>
          <li><strong>Summarization:</strong> Condenses long passages of text into concise, easy-to-digest bullet points.</li>
          <li><strong>Translation:</strong> Breaks down language barriers by translating the text into multiple languages.</li>
        </ul>
        <p>
          By combining these features, we provide a comprehensive solution for all your text processing needs, turning static images into dynamic, workable information.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Who We Are</h2>
        <p>
          We are a small, dedicated team of developers and designers passionate about creating simple, powerful tools that solve real-world problems. We believe in clean design, user privacy, and the transformative potential of artificial intelligence.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>
          Have questions, feedback, or suggestions? We'd love to hear from you! Please reach out to us at <a href="mailto:contact@example.com">contact@example.com</a>.
        </p>
      </div>
    </div>
  );
};