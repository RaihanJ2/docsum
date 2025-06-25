"use client";

import { Download } from "lucide-react";

export function SummaryResult({ summary, onDownload }) {
  if (!summary) return null;

  return (
    <div className="bg-gray-900 border-2 border-gray-100 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-gray-200 font-semibold">Summary</h2>
        <button
          onClick={onDownload}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <Download size={16} className="mr-1" />
          Download
        </button>
      </div>
      <div className="bg-gray-900 border-2 border-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">
        <p className="text-gray-100 whitespace-pre-wrap">{summary}</p>
      </div>
    </div>
  );
}
