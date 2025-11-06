import type { NextApiRequest, NextApiResponse } from 'next';

// This is a placeholder for a real Gemini API call.
// In a real application, you would use the Google AI SDK here.
async function getComplexityFromGemini(code: string): Promise<string> {
    // The prompt is crucial. We ask the AI to act as an expert and return only the Big O notation.
    const prompt = `
        You are an expert computer science professor specializing in algorithm analysis.
        Analyze the following Python code and determine its time complexity.
        Provide only the Big O notation (e.g., O(n), O(n^2), O(log n)) and nothing else.

        Code:
        ${code}
    `;

    // Simulate a network delay for the API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // --- Simulated Gemini Response ---
    // In a real app, this is where you'd get the response from the AI.
    // We'll simulate the logic for different complexities.
    if (code.includes("for") && code.includes("for", code.indexOf("for") + 1)) {
        return "O(n^2)"; // Nested loops
    } else if (code.includes("for") || code.includes("while")) {
        return "O(n)"; // Single loop
    } else {
        return "O(1)"; // No loops
    }
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'Code is required.' });
    }

    try {
        const complexity = await getComplexityFromGemini(code);
        res.status(200).json({ complexity });
    } catch (error) {
        res.status(500).json({ message: 'Error analyzing code complexity.' });
    }
}
