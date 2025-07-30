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
    <div className="glass-card rounded-3xl max-w-3xl mx-auto my-16 p-8 shadow-xl">
      <h2 className="text-4xl font-bold mb-2 gradient-text text-center">Time Complexity Analyzer</h2>
      <p className="text-gray-300 text-center mb-8 text-lg">Paste your code and get an instant time complexity analysis powered by AI.</p>
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center items-center">
        <select
          title="Select Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold shadow"
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50 shadow"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={8}
        placeholder="Paste your code here..."
        className="w-full bg-white/10 text-white rounded-xl p-4 border border-white/20 font-mono mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow"
      />
      <div className="min-h-[48px]">
        {error && <div className="text-red-400 mb-2 text-center font-semibold">{error}</div>}
        {result && (
          <div className="glass-card rounded-2xl p-6 mt-6 text-center border border-blue-400/30 shadow-lg animate-fade-in">
            <div className="mb-2">
              <span className="font-bold text-white text-lg">Time Complexity:</span>{' '}
              <span className="text-blue-400 font-mono text-lg">{result.complexity}</span>
            </div>
            {result.explanation && (
              <div className="text-gray-300 mt-2 text-base">
                {result.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
