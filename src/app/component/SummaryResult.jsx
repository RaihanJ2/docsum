"use client";

import { Download, Copy, FileText, CheckCircle } from "lucide-react";
import { useState } from "react";

export function SummaryResult({ summary, onDownload }) {
  const [copied, setCopied] = useState(false);

  if (!summary) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const wordCount = summary
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-xl font-bold text-gray-100 flex items-center">
          <div className="bg-emerald-500 p-2 rounded-lg mr-3">
            <FileText size={20} className="text-white" />
          </div>
          Summary
        </h2>

        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-400">
            {wordCount} words • {readingTime} min read
          </div>
          <div className="flex space-x-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
            >
              {copied ? (
                <>
                  <CheckCircle size={16} className="text-green-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={onDownload}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 border-2 border-gray-600 rounded-xl p-6 max-h-96 overflow-y-auto">
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-100 whitespace-pre-wrap leading-relaxed text-base">
            {summary}
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
          <span className="text-emerald-400 font-medium">✓ Generated</span>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
          <span className="text-blue-400 font-medium">{wordCount} words</span>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-2">
          <span className="text-purple-400 font-medium">
            {readingTime} min read
          </span>
        </div>
      </div>
    </div>
  );
}
