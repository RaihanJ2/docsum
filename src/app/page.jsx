"use client";

import { useState } from "react";
import { SummaryOptions } from "./component/SummaryOptions";
import { TextInput } from "./component/TextInput";
import { FileUpload } from "./component/Upload";
import { SummaryResult } from "./component/SummaryResult";
import { HistoryPanel } from "./component/HistoryPanel";

export function useSummarizer() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryType, setSummaryType] = useState("general");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [history, setHistory] = useState([]);

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

  return {
    file,
    setFile,
    text,
    setText,
    summary,
    setSummary,
    loading,
    summaryType,
    setSummaryType,
    summaryLength,
    setSummaryLength,
    history,
    summarizeText,
    clearHistory,
    downloadSummary,
  };
}

export default function Home() {
  const {
    file,
    setFile,
    text,
    setText,
    summary,
    setSummary,
    loading,
    summaryType,
    setSummaryType,
    summaryLength,
    setSummaryLength,
    history,
    summarizeText,
    clearHistory,
    downloadSummary,
  } = useSummarizer();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-300 mb-4">
              AI Document Summarizer
            </h1>
            <p className="text-lg text-gray-100">
              Upload PDFs or paste text to get intelligent summaries powered by
              AI
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              <FileUpload file={file} setFile={setFile} />
              <TextInput text={text} setText={setText} />
              <SummaryOptions
                summaryType={summaryType}
                setSummaryType={setSummaryType}
                summaryLength={summaryLength}
                setSummaryLength={setSummaryLength}
                onSummarize={summarizeText}
                loading={loading}
                disabled={!text && !file}
              />
            </div>

            {/* Results & History Section */}
            <div className="space-y-6">
              <SummaryResult summary={summary} onDownload={downloadSummary} />
              <HistoryPanel
                history={history}
                onClearHistory={clearHistory}
                onSelectSummary={setSummary}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
