import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

if (!apiKey) {
  console.warn(
    "NEXT_PUBLIC_GEMINI_API_KEY is not defined. Time complexity analysis functionality will not work."
  );
}

export const genAI = new GoogleGenerativeAI(apiKey);
export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

// Cache for storing previous time complexity results
type TimeComplexityCacheKey = string;
type TimeComplexityCache = {
  [key: TimeComplexityCacheKey]: {
    complexity: string;
    graphData: { n: number; ops: number }[];
    explanation: string;
  };
};
const timeComplexityCache: TimeComplexityCache = {};

// Generate a cache key for time complexity
function generateTimeComplexityCacheKey(
  code: string,
  language: string
): TimeComplexityCacheKey {
  return `${language}_time_complexity_${code}`;
}

/**
 * Analyzes the time complexity of the given code using Gemini.
 * Returns an object with the complexity (e.g., O(n)), a simple graph data array, and an explanation.
 */
export async function analyzeTimeComplexityWithGemini(
  code: string,
  language: string
): Promise<{
  complexity: string;
  graphData: { n: number; ops: number }[];
  explanation: string;
}> {
  const cacheKey = generateTimeComplexityCacheKey(code, language);

  // Check cache
  if (timeComplexityCache[cacheKey]) {
    console.log("Using cached time complexity result");
    return timeComplexityCache[cacheKey];
  }

  try {
    const prompt = `
Analyze the following ${language} code and estimate its time complexity using Big O notation.
Return your answer in the following JSON format:

{
  "complexity": "O(n^2)",
  "graphData": [
    {"n": 1, "ops": 1},
    {"n": 2, "ops": 4},
    {"n": 3, "ops": 9},
    {"n": 4, "ops": 16},
    {"n": 5, "ops": 25}
  ],
  "explanation": "This code uses a nested loop, so for each n, it does n*n operations."
}

Here is the code:

\`\`\`${language}
${code}
\`\`\`
`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let parsed;
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      // fallback: try to parse the whole response
      parsed = JSON.parse(text);
    }

    // Store in cache
    timeComplexityCache[cacheKey] = parsed;

    return parsed;
  } catch (error) {
    console.error("Error analyzing time complexity:", error);
    throw new Error(
      "Failed to analyze time complexity. Please check your API key and try again."
    );
  }
}
