import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { testCases } from '../../utils/problems/testCases';
import { generateDriverCode } from '../../utils/problems/driver';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { code, problemId } = req.body;
    const problemHiddenCases = testCases[problemId]?.hiddenCases;

    if (!problemHiddenCases) {
        return res.status(404).json({ message: 'Problem test cases not found.' });
    }

    const languageId = 71; // CORRECTED: 71 is the ID for Python 3

    const submissions = problemHiddenCases.map(testCase => {
        const fullCode = generateDriverCode(problemId, code, testCase.inputText);
        return {
            source_code: fullCode,
            language_id: languageId,
            expected_output: testCase.outputText,
        };
    });

    try {
        const response = await axios.post(
            `https://judge0-ce.p.rapidapi.com/submissions/batch?base64_encoded=false`,
            { submissions },
            {
                headers: {
                    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                },
            }
        );

        const tokens = response.data.map((s: any) => s.token).join(',');
        let results: any[];
        do {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const statusResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/batch?tokens=${tokens}&base64_encoded=false&fields=status_id,stdout,stderr,time,memory`, {
                headers: {
                    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                },
            });
            results = statusResponse.data.submissions;
        } while (results.some(s => s.status_id <= 2));

        const failedCase = results.find(r => r.status_id !== 3);
        if (failedCase) {
            return res.status(200).json({
                status: "Wrong Answer",
                output: `Failed on a hidden test case.\nYour output:\n${failedCase.stdout || failedCase.stderr || "No output"}`,
            });
        }

        const totalTime = results.reduce((acc, r) => acc + parseFloat(r.time), 0);
        const avgTime = (totalTime / results.length).toFixed(3);
        const maxMemory = Math.max(...results.map(r => r.memory));

        return res.status(200).json({
            status: "Accepted",
            output: "All hidden test cases passed!",
            time: `${avgTime}s`,
            memory: maxMemory,
        });

    } catch (error) {
        return res.status(500).json({ status: "Error", output: "An error occurred during submission." });
    }
}