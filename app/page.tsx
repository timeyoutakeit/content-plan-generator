"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input }),
    });

    const data = await res.json();
    setResult(data.plan || "No plan generated.");
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: "800px", margin: "auto", padding: "2rem" }}>
      <h1>Content Plan Generator</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste PRs, messages, or notes here..."
        rows={8}
        style={{ width: "100%", marginBottom: "1rem", borderColor: "white", borderWidth: "1px" }}
      />

<button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {result && (
        <pre
          style={{
            marginTop: "1rem",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          {result}
        </pre>
      )}
    </main>
  );
}
