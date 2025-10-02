import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  async function handleGenerate() {
    setLoading(true);

    // 🔧 TODO: Add your Gemini API call here
    // For now, just simulate a response
    setTimeout(() => {
      setResult("✨ This is where your generated content plan will appear.");
      setLoading(false);
    }, 1000);
  }

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "2rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>Content Plan Generator</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste PRs, messages, or notes here..."
        rows={8}
        style={{
          width: "100%",
          marginBottom: "1rem",
          padding: "0.5rem",
          fontSize: "1rem",
        }}
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !input.trim()}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Content Plan"}
      </button>

      {result && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#f9f9f9",
            color: "black",
          }}
        >
          <h2>Generated Plan</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
