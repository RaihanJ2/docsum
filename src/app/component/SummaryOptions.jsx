"use client";

import { Loader2, Settings, Zap } from "lucide-react";

export function SummaryOptions({
  summaryType,
  setSummaryType,
  summaryLength,
  setSummaryLength,
  onSummarize,
  loading,
  disabled,
}) {
  const summaryTypeOptions = [
    {
      value: "general",
      label: "General Summary",
      icon: "📄",
      desc: "Comprehensive overview",
    },
    {
      value: "bullets",
      label: "Bullet Points",
      icon: "•",
      desc: "Key points in list format",
    },
    { value: "tldr", label: "TL;DR", icon: "⚡", desc: "Quick essence" },
    {
      value: "key-points",
      label: "Key Points",
      icon: "🎯",
      desc: "Main takeaways",
    },
    {
      value: "executive",
      label: "Executive Summary",
      icon: "👔",
      desc: "Business-focused",
    },
  ];

  const summaryLengthOptions = [
    { value: "short", label: "Short", desc: "1-2 paragraphs", time: "~30s" },
    { value: "medium", label: "Medium", desc: "3-4 paragraphs", time: "~1m" },
    { value: "long", label: "Long", desc: "5+ paragraphs", time: "~2m" },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 hover:border-gray-500 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center">
        <div className="bg-green-500 p-2 rounded-lg mr-3">
          <Settings size={20} className="text-white" />
        </div>
        Summary Options
      </h2>

      <div className="space-y-6">
        {/* Summary Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Summary Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {summaryTypeOptions.map((option) => (
              <div
                key={option.value}
                className={`relative cursor-pointer transition-all duration-200 ${
                  summaryType === option.value
                    ? "ring-2 ring-blue-500 bg-blue-500/10"
                    : "hover:bg-gray-700/50 hover:border-gray-500"
                } border-2 border-gray-600 rounded-xl p-3`}
                onClick={() => setSummaryType(option.value)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{option.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-100 font-medium text-sm truncate">
                      {option.label}
                    </p>
                    <p className="text-gray-400 text-xs">{option.desc}</p>
                  </div>
                </div>
                {summaryType === option.value && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Length */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Summary Length
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {summaryLengthOptions.map((option) => (
              <div
                key={option.value}
                className={`relative cursor-pointer transition-all duration-200 ${
                  summaryLength === option.value
                    ? "ring-2 ring-blue-500 bg-blue-500/10"
                    : "hover:bg-gray-700/50 hover:border-gray-500"
                } border-2 border-gray-600 rounded-xl p-4 text-center`}
                onClick={() => setSummaryLength(option.value)}
              >
                <p className="text-gray-100 font-semibold text-sm mb-1">
                  {option.label}
                </p>
                <p className="text-gray-400 text-xs mb-1">{option.desc}</p>
                <p className="text-gray-500 text-xs">{option.time}</p>
                {summaryLength === option.value && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onSummarize}
        disabled={disabled || loading}
        className={`w-full mt-8 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
          disabled
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : loading
            ? "bg-blue-600 text-white cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:scale-105 transform"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            <span>Generating Summary...</span>
          </>
        ) : (
          <>
            <Zap size={24} />
            <span>Generate Summary</span>
          </>
        )}
      </button>

      {disabled && (
        <p className="text-center text-gray-400 text-sm mt-3">
          Upload a file or paste text to get started
        </p>
      )}
    </div>
  );
}
