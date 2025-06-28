"use client";

import { History, Trash2, Clock, FileText, Eye, Loader2 } from "lucide-react";

export function HistoryPanel({
  history,
  loading,
  onClearHistory,
  onSelectSummary,
}) {
  const getSummaryTypeIcon = (type) => {
    const icons = {
      general: "📄",
      bullets: "•",
      tldr: "⚡",
      "key-points": "🎯",
      executive: "👔",
    };
    return icons[type] || "📄";
  };

  const getLengthColor = (length) => {
    const colors = {
      short: "text-green-400 bg-green-500/10 border-green-500/20",
      medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
      long: "text-red-400 bg-red-500/10 border-red-500/20",
    };
    return colors[length] || "text-gray-400 bg-gray-500/10 border-gray-500/20";
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-100 flex items-center">
          <div className="bg-orange-500 p-2 rounded-lg mr-3">
            <History size={20} className="text-white" />
          </div>
          History
          {history.length > 0 && (
            <span className="ml-2 bg-orange-500/20 text-orange-400 text-sm font-medium px-2 py-1 rounded-full">
              {history.length}
            </span>
          )}
        </h2>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
          >
            <Trash2 size={16} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="bg-gray-700/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Loader2 size={32} className="text-blue-500 animate-spin" />
          </div>
          <p className="text-gray-400 text-lg font-medium mb-2">
            Loading history...
          </p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-700/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-gray-500" />
          </div>
          <p className="text-gray-400 text-lg font-medium mb-2">
            No summaries yet
          </p>
          <p className="text-gray-500 text-sm">
            Generate your first summary to see it here!
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((item, index) => (
            <div
              key={item.id}
              className="group bg-gray-700/30 hover:bg-gray-700/50 border-2 border-gray-600 hover:border-gray-500 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg"
              onClick={() => onSelectSummary(item.summary)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span className="text-lg">
                    {getSummaryTypeIcon(item.type)}
                  </span>
                  <h3 className="font-semibold text-gray-100 text-sm truncate">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <span className="text-xs text-gray-400">
                    {formatTimestamp(item.timestamp)}
                  </span>
                  <Eye
                    size={14}
                    className="text-gray-500 group-hover:text-gray-400 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-medium text-gray-300 bg-gray-600/50 px-2 py-1 rounded-md">
                  {item.type}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-md border ${getLengthColor(
                    item.length
                  )}`}
                >
                  {item.length}
                </span>
              </div>

              <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                {item.summary.substring(0, 120)}
                {item.summary.length > 120 && "..."}
              </p>

              <div className="mt-3 pt-2 border-t border-gray-600/50">
                <p className="text-xs text-gray-500 flex items-center">
                  <FileText size={12} className="mr-1" />
                  Click to view full summary
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-600/50">
          <p className="text-center text-gray-500 text-xs">
            Showing latest {history.length} summaries
          </p>
        </div>
      )}
    </div>
  );
}
