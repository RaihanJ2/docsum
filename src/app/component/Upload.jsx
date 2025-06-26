"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";

export function FileUpload({ file, setFile }) {
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

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setFile(e.dataTransfer.files[0]);
      }
    },
    [setFile]
  );

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 hover:border-gray-500 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center">
        <div className="bg-blue-500 p-2 rounded-lg mr-3">
          <Upload size={20} className="text-white" />
        </div>
        Upload Document
      </h2>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? "border-blue-400 bg-blue-500/10 scale-[1.02]"
            : "border-gray-500 hover:border-gray-400 hover:bg-gray-800/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <div className="mb-4">
              <FileText
                className="mx-auto text-gray-400 animate-pulse"
                size={56}
              />
            </div>
            <p className="text-gray-300 mb-6 text-lg">
              Drag & drop your document here
            </p>
            <p className="text-gray-400 mb-6 text-sm">
              or click to browse files
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
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Upload size={18} className="mr-2" />
              Choose File
            </label>
            <p className="text-xs text-gray-500 mt-4">
              Supports PDF, TXT, DOC, DOCX (Max 10MB)
            </p>
          </>
        ) : (
          <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <CheckCircle size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-gray-100 font-medium truncate max-w-[200px] sm:max-w-[235px]">
                    {file.name}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {getFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-gray-400 hover:text-red-400 p-1 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
