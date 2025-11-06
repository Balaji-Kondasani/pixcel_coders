// src/utils/problems/index.ts
import { twoSum } from "./two-sum";
import { addTwoNumbers } from "./add-two-numbers"; // 1. Import the new problem
import { Problem } from "@/types/problem";

interface ProblemMap {
    [key: string]: Problem;
}

export const problems: ProblemMap = {
    "two-sum": twoSum,
    "add-two-numbers": addTwoNumbers,
};