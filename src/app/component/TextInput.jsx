"use client";

import { Type } from "lucide-react";

export function TextInput({ text, setText }) {
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const charCount = text.length;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 hover:border-gray-500 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center">
        <div className="bg-purple-500 p-2 rounded-lg mr-3">
          <Type size={20} className="text-white" />
        </div>
        Or Paste Text Directly
      </h2>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here for instant summarization..."
          className="w-full h-48 sm:h-56 lg:h-64 p-4 bg-gray-700/50 text-gray-100 border-2 border-gray-600 rounded-xl resize-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-base leading-relaxed"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#4B5563 #374151" }}
        />

        {/* Character/Word Counter */}
        <div className="flex justify-between items-center mt-3 text-sm">
          <div className="text-gray-400">
            {text ? (
              <span>
                {wordCount} words • {charCount} characters
              </span>
            ) : (
              <span>Start typing to see word count</span>
            )}
          </div>
          <div className="text-gray-500">
            {charCount > 0 && (
              <div
                className={`px-2 py-1 rounded-lg text-xs ${
                  charCount > 10000
                    ? "bg-red-500/20 text-red-400"
                    : charCount > 5000
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {charCount > 10000
                  ? "Very Long"
                  : charCount > 5000
                  ? "Long"
                  : "Good Length"}
              </div>
            )}
          </div>
        </div>
      </div>

      {text && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="text-blue-300 text-sm flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
            Text ready for summarization
          </div>
        </div>
      )}
    </div>
  );
}
