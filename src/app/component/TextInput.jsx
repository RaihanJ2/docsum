"use client";

export function TextInput({ text, setText }) {
  return (
    <div className="bg-gray-900 border-2 border-gray-100 rounded-xl shadow-lg p-6">
      <h2 className="text-xl text-gray-100 font-semibold mb-4">
        Or Paste Text Directly
      </h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        className="w-full h-40 p-4 text-gray-100 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
