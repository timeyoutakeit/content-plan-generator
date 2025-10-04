"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");

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

      <button disabled>
        Generate
      </button>
    </main>
  );
}
