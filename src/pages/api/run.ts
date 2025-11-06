import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { generateDriverCode } from '../../utils/problems/driver';

type ResponseData = {
    status: string;
    message?: string;
    output?: string;
};

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'Error', message: 'Method Not Allowed' });
    }

    const { code, input, problemId } = req.body;
    const languageId = 71; // CORRECTED: 71 is the ID for Python 3

    const fullCode = generateDriverCode(problemId, code, input);

    try {
        const submissionResponse = await axios.post(
            `${JUDGE0_API_URL}?base64_encoded=false&wait=true`,
            {
                source_code: fullCode,
                language_id: languageId,
            },
            {
                headers: {
                    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                    'Content-Type': 'application/json',
                },
            }
        );

        const result = submissionResponse.data;

        if (result.status.id === 3) { // Accepted
            return res.status(200).json({ status: 'Accepted', output: result.stdout });
        } else {
            return res.status(200).json({
                status: 'Error',
                message: result.stderr || result.compile_output || "Execution failed",
                output: result.stdout || ""
            });
        }
    } catch (error: any) {
        return res.status(500).json({ status: 'Server Error', message: 'Could not execute code.' });
    }
}