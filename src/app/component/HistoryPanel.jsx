"use client";

import { History, Trash2 } from "lucide-react";

export function HistoryPanel({ history, onClearHistory, onSelectSummary }) {
  return (
    <div className="bg-gray-900 border-2 border-gray-100   text-gray-100 hover:text-gray-900 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-gray-100 font-semibold flex items-center">
          <History className="mr-2 " size={20} />
          History
        </h2>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-red-500 hover:text-red-600 flex items-center"
          >
            <Trash2 size={16} className="mr-1" />
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-gray-200 text-center py-8">
          No summaries yet. Generate your first summary!
        </p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((item) => (
            <div
              key={item.id}
              className="text-gray-100 border border-gray-200 rounded-lg p-3 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectSummary(item.summary)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm truncate">{item.title}</h3>
                <span className="text-xs">{item.timestamp}</span>
              </div>
              <div className="text-xs  mb-2">
                {item.type} • {item.length}
              </div>
              <p className="text-sm  line-clamp-2">
                {item.summary.substring(0, 100)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
