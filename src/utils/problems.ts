// --- Prop Types Definitions ---

export interface Problem {
    id: number;
    title: string;
    titleId: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    acceptance: number;
    status: 'Solved' | 'Attempted' | 'Unsolved';
    isPremium: boolean;
    videoUrl?: string;
    description: string;
    examples: { id: number; inputText: string; outputText: string; explanation?: string; }[];
}


// --- Mock Problems Data ---

export const mockProblems: Problem[] = [
    { 
        id: 1, 
        title: 'Two Sum', 
        titleId: 'two-sum', 
        difficulty: 'Easy', 
        category: 'Array', 
        acceptance: 56.1, 
        status: 'Solved', 
        isPremium: false, 
        videoUrl: 'https://www.youtube.com/watch?v=KLlXCFG5TnA',
        description: `<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p><p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the <em>same</em> element twice.</p><p>You can return the answer in any order.</p>`,
        examples: [
            { id: 1, inputText: "nums = [2,7,11,15], target = 9", outputText: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
            { id: 2, inputText: "nums = [3,2,4], target = 6", outputText: "[1,2]" },
        ]
    },
    // You can add the rest of your detailed problem objects here...
];
