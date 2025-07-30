"use client";

import { useState } from "react";
import { analyzeTimeComplexityWithGemini } from "@/lib/gemini";

const LANGUAGES = [
  "python",
  "javascript",
  "java",
  "c++",
  "c",
  "typescript",
  "go",
  "ruby",
  "swift",
  "kotlin",
];

export default function TimeComplexityAnalyzer() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    complexity: string;
    graphData: { n: number; ops: number }[];
    explanation: string;
  }>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await analyzeTimeComplexityWithGemini(code, language);
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Failed to analyze time complexity");
    }
    setLoading(false);
  };

  return (
    <div className="glass-card rounded-2xl p-6 max-w-2xl mx-auto my-12">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Time Complexity Analyzer
      </h2>
      <div className="mb-4 flex gap-4">
        <select
          title="Select Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang} className="bg-gray-900">
              {lang}
            </option>
          ))}
        </select>
        <button
          onClick={handleAnalyze}
          disabled={loading || !code.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={8}
        placeholder="Paste your code here..."
        className="w-full bg-white/10 text-white rounded-lg p-3 border border-white/20 font-mono mb-4"
      />
      <div>
        {error && <div className="text-red-400 mb-2">{error}</div>}
        {result && (
          <div className="mt-6">
            <div className="mb-2">
              <span className="font-bold text-white">Time Complexity:</span>{" "}
              <span className="text-blue-400 font-mono">
                {result.complexity}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
