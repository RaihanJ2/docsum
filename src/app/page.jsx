"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  Loader2,
  Download,
  History,
  Trash2,
} from "lucide-react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryType, setSummaryType] = useState("general");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [history, setHistory] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const extractTextFromFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract text");
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      throw new Error("Failed to extract text from file");
    }
  };

  const summarizeText = async () => {
    if (!text && !file) return;

    setLoading(true);
    try {
      let textToSummarize = text;

      if (file && !text) {
        textToSummarize = await extractTextFromFile(file);
      }

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textToSummarize,
          summaryType,
          summaryLength,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to summarize");
      }

      const data = await response.json();
      const newSummary = data.summary;
      setSummary(newSummary);

      // Add to history
      const historyItem = {
        id: Date.now(),
        title: file ? file.name : "Text Input",
        summary: newSummary,
        type: summaryType,
        length: summaryLength,
        timestamp: new Date().toLocaleString(),
      };

      setHistory((prev) => [historyItem, ...prev]);
    } catch (error) {
      console.error("Summarization failed:", error);
      alert("Failed to summarize. Please check your API key and try again.");
    }
    setLoading(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const downloadSummary = () => {
    const element = document.createElement("a");
    const file = new Blob([summary], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "summary.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              AI Document Summarizer
            </h1>
            <p className="text-lg text-gray-600">
              Upload PDFs or paste text to get intelligent summaries powered by
              AI
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* File Upload */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Upload className="mr-2" size={20} />
                  Upload Document
                </h2>

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600 mb-4">
                    Drag & drop your PDF file here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
                  >
                    Choose File
                  </label>
                  {file && (
                    <p className="mt-4 text-sm text-gray-600">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Text Input */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Or Paste Text Directly
                </h2>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your text here..."
                  className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Summary Options */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Summary Options</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Summary Type
                    </label>
                    <select
                      value={summaryType}
                      onChange={(e) => setSummaryType(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General Summary</option>
                      <option value="bullets">Bullet Points</option>
                      <option value="tldr">TL;DR</option>
                      <option value="key-points">Key Points</option>
                      <option value="executive">Executive Summary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Summary Length
                    </label>
                    <select
                      value={summaryLength}
                      onChange={(e) => setSummaryLength(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="short">Short (1-2 paragraphs)</option>
                      <option value="medium">Medium (3-4 paragraphs)</option>
                      <option value="long">Long (5+ paragraphs)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={summarizeText}
                  disabled={loading || (!text && !file)}
                  className="w-full mt-6 bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
            </div>

            {/* Results & History Section */}
            <div className="space-y-6">
              {/* Summary Result */}
              {summary && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Summary</h2>
                    <button
                      onClick={downloadSummary}
                      className="flex items-center text-blue-500 hover:text-blue-600"
                    >
                      <Download size={16} className="mr-1" />
                      Download
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {summary}
                    </p>
                  </div>
                </div>
              )}

              {/* History */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <History className="mr-2" size={20} />
                    History
                  </h2>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-red-500 hover:text-red-600 flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Clear
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No summaries yet. Generate your first summary!
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSummary(item.summary)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-sm truncate">
                            {item.title}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {item.timestamp}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          {item.type} • {item.length}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {item.summary.substring(0, 100)}...
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
