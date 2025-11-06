import { firestore } from '@/Firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';
// 1. IMPORT the problems from your single source of truth
import { mockProblems } from '../../MockProblems/problems';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    try {
        // 2. LOOP through the imported mockProblems array
        for (const problem of mockProblems) {
            // 3. USE the 'titleId' for the document ID, as your app uses it for routing
            const problemRef = doc(firestore, "problems", problem.titleId);
            
            // 4. PREPARE the data for Firestore, ensuring all fields match
            //    We create a new object to make sure we only send the data we want to the DB.
            const problemDataForDb = {
                id: problem.titleId, // Use titleId for consistency
                title: problem.title,
                difficulty: problem.difficulty,
                category: problem.category,
                order: problem.id, // Assuming the original 'id' number is the order
                videoId: problem.videoUrl || "",
                link: "", // Add other fields if needed
                likes: 0, // Initialize likes/dislikes
                dislikes: 0,
                acceptance: problem.acceptance,
                // The problemStatement, examples, and starterCode are already in the problem object
                problemStatement: problem.problemStatement,
                examples: problem.examples,
                starterCode: problem.starterCode,
                constraints: problem.constraints,
            };

            await setDoc(problemRef, problemDataForDb);
        }
        res.status(200).json({ success: true, message: "Problems successfully synced with Firestore." });
    } catch (error: any) {
        console.error("Error seeding problems:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}
