import React from 'react';

const blogPosts = [
  {
    title: 'How to Extract Text from an Image: A Guide to OCR Technology',
    content: `
      <p>Have you ever needed to get text from a picture, screenshot, or scanned document? The technology that makes this possible is called Optical Character Recognition, or OCR. It's a powerful process that converts images of typed, handwritten, or printed text into machine-readable text data.</p>
      <p>Our Screenshot Text Extractor uses an advanced AI model to perform OCR with incredible accuracy. Simply upload your image, and our tool analyzes the pixels to identify characters, words, and sentences. It's perfect for digitizing notes, saving quotes from social media, or grabbing information from a presentation slide.</p>
      <h3 class="text-xl font-semibold mt-6 mb-2">Why is AI-powered OCR better?</h3>
      <p>Traditional OCR tools can struggle with varied fonts, low-quality images, or complex layouts. By leveraging a powerful AI like Google's Gemini, our tool can understand context, handle noise in images, and recognize text in a way that mimics human perception, leading to far more accurate results.</p>
    `
  },
  {
    title: '5 Ways Our Tool Boosts Productivity for Students & Professionals',
    content: `
      <p>In today's fast-paced digital world, efficiency is key. Manually retyping text from images is a time-consuming task that kills productivity. Here's how our tool can help you work smarter, not harder.</p>
      <ol class="list-decimal list-inside space-y-2 mt-4">
        <li><strong>Students:</strong> Quickly grab text from lecture slides, textbook pages, or research papers. Summarize key points for easy revision.</li>
        <li><strong>Professionals:</strong> Extract data from invoices, receipts, or presentation screenshots. Correct and format the text for reports in seconds.</li>
        <li><strong>Content Creators:</strong> Save interesting quotes or stats you find online. Easily translate content to reach a wider audience.</li>
        <li><strong>Researchers:</strong> Digitize text from old books or academic articles that aren't available in digital formats.</li>
        <li><strong>Everyone:</strong> Save recipes from a video, copy contact info from a business card, or grab text from a social media post without having to retype it.</li>
      </ol>
    `
  },
  {
    title: 'Beyond Extraction: Summarize and Translate with a Single Click',
    content: `
      <p>Getting text from an image is just the first step. The real power of our tool lies in what you can do with that text afterward. Powered by the versatile Gemini AI, we offer a full suite of text processing tools.</p>
      <h3 class="text-xl font-semibold mt-6 mb-2">One Tool, Multiple Functions</h3>
      <ul class="list-disc list-inside space-y-2 mt-4">
        <li><strong>Grammar Correction:</strong> Don't just extract text—perfect it. Our tool automatically fixes spelling mistakes and grammatical errors.</li>
        <li><strong>AI Summarizer:</strong> Drowning in information? Get the key takeaways in seconds. The AI generates a concise, bullet-point summary of the extracted text.</li>
        <li><strong>Multi-language Translation:</strong> Instantly translate the cleaned text into several languages, including Hindi, Tamil, and more, breaking down communication barriers.</li>
      </ul>
      <p class="mt-4">This all-in-one approach saves you from juggling multiple apps and websites, creating a seamless workflow from image to insight.</p>
    `
  },
];

export const BlogPage: React.FC = () => {
  return (
    <div className="animate-fade-in bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="prose prose-lg max-w-none text-gray-700 dark:prose-invert prose-headings:font-bold prose-headings:text-gray-800 prose-a:text-indigo-600 hover:prose-a:text-indigo-500 dark:prose-headings:text-gray-100 dark:prose-a:text-indigo-400">
        <h1 className="text-4xl font-bold mb-6">Blog & Insights</h1>
        <p className="text-xl">Learn more about our technology, use cases, and how to get the most out of the Screenshot Text Extractor.</p>
        
        <div className="mt-12 space-y-12">
          {blogPosts.map((post, index) => (
            <article key={index} className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-3xl font-semibold mb-4">{post.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};