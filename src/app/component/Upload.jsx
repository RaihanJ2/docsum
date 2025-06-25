"use client";

import { useState, useCallback } from "react";
import { Upload, FileText } from "lucide-react";

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

  return (
    <div className="bg-gray-900 border-2 border-gray-100 rounded-xl shadow-lg p-6">
      <h2 className="text-xl text-gray-100 font-semibold mb-4 flex items-center">
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
        <p className="text-gray-200 mb-4">
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
          <p className="mt-4 text-sm text-gray-600">Selected: {file.name}</p>
        )}
      </div>
    </div>
  );
}
