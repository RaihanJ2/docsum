"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SummaryOptions } from "./component/SummaryOptions";
import { TextInput } from "./component/TextInput";
import { FileUpload } from "./component/Upload";
import { SummaryResult } from "./component/SummaryResult";
import { HistoryPanel } from "./component/HistoryPanel";
import { LoginButton } from "./component/LoginButton";
import { Brain, Sparkles, TrendingUp } from "lucide-react";

export function useSummarizer() {
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryType, setSummaryType] = useState("general");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Load history when user is authenticated
  useEffect(() => {
    if (session) {
      loadHistory();
    } else {
      setHistory([]);
    }
  }, [session]);

  const loadHistory = async () => {
    if (!session) return;

    setLoadingHistory(true);
    try {
      const response = await fetch("/api/summaries");
      if (response.ok) {
        const data = await response.json();
        const formattedHistory = data.summaries.map((item) => ({
          id: item._id,
          title: item.title,
          summary: item.summary,
          type: item.summaryType,
          length: item.summaryLength,
          timestamp: item.createdAt,
        }));
        setHistory(formattedHistory);
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    }
    setLoadingHistory(false);
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

      // Save to database if user is logged in
      if (session) {
        try {
          await fetch("/api/summaries", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: file ? file.name : "Text Input",
              originalText: textToSummarize,
              summary: newSummary,
              summaryType,
              summaryLength,
            }),
          });

          // Reload history to show the new summary
          loadHistory();
        } catch (error) {
          console.error("Failed to save summary:", error);
          // Continue even if saving fails - show a notification
        }
      } else {
        // Add to local history for non-authenticated users
        const historyItem = {
          id: Date.now(),
          title: file ? file.name : "Text Input",
          summary: newSummary,
          type: summaryType,
          length: summaryLength,
          timestamp: new Date().toISOString(),
        };
        setHistory((prev) => [historyItem, ...prev]);
      }
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
    loadingHistory,
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
    loadingHistory,
    summarizeText,
    clearHistory,
    downloadSummary,
  } = useSummarizer();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header with Login */}
          <div className="flex justify-between items-start mb-8">
            <div className="text-center flex-1">
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-red-400 to-gray-100 bg-clip-text text-transparent mb-6">
                DocSum
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Transform lengthy documents into concise, intelligent summaries
                powered by advanced AI technology
              </p>
            </div>
            <div className="mt-4">
              <LoginButton />
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Input Section */}
            <div className="xl:col-span-3 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FileUpload file={file} setFile={setFile} />
                <TextInput text={text} setText={setText} />
              </div>

              <SummaryOptions
                summaryType={summaryType}
                setSummaryType={setSummaryType}
                summaryLength={summaryLength}
                setSummaryLength={setSummaryLength}
                onSummarize={summarizeText}
                loading={loading}
                disabled={!text && !file}
              />

              {summary && (
                <SummaryResult summary={summary} onDownload={downloadSummary} />
              )}
            </div>

            {/* History Section */}
            <div className="xl:col-span-1">
              <div className="sticky top-8">
                <HistoryPanel
                  history={history}
                  loading={loadingHistory}
                  onClearHistory={clearHistory}
                  onSelectSummary={setSummary}
                />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          {history.length > 0 && (
            <div className="mt-16 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-600 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-100 mb-6 text-center">
                Your Summary Statistics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {history.length}
                  </div>
                  <div className="text-gray-400">Total Summaries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {history.filter((h) => h.type === "general").length}
                  </div>
                  <div className="text-gray-400">General Summaries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {history.filter((h) => h.length === "short").length}
                  </div>
                  <div className="text-gray-400">Quick Summaries</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
