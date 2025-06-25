"use client";

import { Loader2 } from "lucide-react";

export function SummaryOptions({
  summaryType,
  setSummaryType,
  summaryLength,
  setSummaryLength,
  onSummarize,
  loading,
  disabled,
}) {
  return (
    <div className="bg-gray-900 border-2 border-gray-100 text-gray-100 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Summary Options</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Summary Type
          </label>
          <select
            value={summaryType}
            onChange={(e) => setSummaryType(e.target.value)}
            className="w-full p-3 border bg-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">General Summary</option>
            <option value="bullets">Bullet Points</option>
            <option value="tldr">TL;DR</option>
            <option value="key-points">Key Points</option>
            <option value="executive">Executive Summary</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Summary Length
          </label>
          <select
            value={summaryLength}
            onChange={(e) => setSummaryLength(e.target.value)}
            className="w-full p-3 border bg-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="short">Short (1-2 paragraphs)</option>
            <option value="medium">Medium (3-4 paragraphs)</option>
            <option value="long">Long (5+ paragraphs)</option>
          </select>
        </div>
      </div>

      <button
        onClick={onSummarize}
        disabled={disabled || loading}
        className="w-full cursor-pointer mt-6 bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={20} />
            Generating Summary...
          </>
        ) : (
          "Generate Summary"
        )}
      </button>
    </div>
  );
}
