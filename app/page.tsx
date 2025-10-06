"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!input.trim()) {
      setResult("Please add some content above to generate a plan.");
      return;
    }
    setResult("");
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input }),
    });

    if (!res.ok || !res.body) {
      setResult("Error: no response body from server");
      setLoading(false);
      return;
    }
  
    try {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setResult((prev) => prev + chunk); // update UI progressively
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-10">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">Content Plan Generator</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste PRs, messages, or notes here..."
        rows={8}
        className="w-full p-4 border border-purple-300 rounded-lg mb-6 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out"
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {result && (
        <pre
          className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 border border-purple-300 rounded-lg whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200"
        >
          {result}
        </pre>
      )}
    </main>
  );
}
