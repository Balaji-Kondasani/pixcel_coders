import assert from "assert";
import { Problem } from "@/types/problem";

// NOTE: In a real environment, you would need a utility to convert arrays to linked lists and vice versa.
// For this handler, we will simulate it by reversing the arrays to mimic the list structure.
const starterCodeAddTwoNumbers = `function addTwoNumbers(l1, l2) {
  // Write your code here
};`;

const handlerAddTwoNumbers = (fn: any) => {
    try {
        const testCases = [
            { l1: [2, 4, 3], l2: [5, 6, 4], answer: [7, 0, 8] },
            { l1: [0], l2: [0], answer: [0] },
            { l1: [9, 9, 9, 9, 9, 9, 9], l2: [9, 9, 9, 9], answer: [8, 9, 9, 9, 0, 0, 0, 1] },
        ];

        for (const { l1, l2, answer } of testCases) {
            const result = fn(l1, l2);
            assert.deepStrictEqual(result, answer);
        }
        return true;
    } catch (error: any) {
        console.log("addTwoNumbers handler function error");
        throw new Error(error);
    }
};

export const addTwoNumbers: Problem = {
    id: "add-two-numbers",
    title: "2. Add Two Numbers",
    problemStatement: `<p class='mt-3'>
  You are given two <strong>non-empty</strong> linked lists representing two non-negative integers. The digits are stored in <strong>reverse order</strong>, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.
</p>
<p class='mt-3'>
  You may assume the two numbers do not contain any leading zero, except the number 0 itself.
</p>`,
    examples: [
        {
            id: 1,
            inputText: "l1 = [2,4,3], l2 = [5,6,4]",
            outputText: "[7,0,8]",
            explanation: "342 + 465 = 807.",
        },
        {
            id: 2,
            inputText: "l1 = [0], l2 = [0]",
            outputText: "[0]",
        },
        {
            id: 3,
            inputText: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
            outputText: "[8,9,9,9,0,0,0,1]",
        },
    ],
    constraints: `<li class='mt-2'>
  The number of nodes in each linked list is in the range <code>[1, 100]</code>.
</li> 
<li class='mt-2'>
  <code>0 <= Node.val <= 9</code>
</li>
<li class='mt-2'>
  It is guaranteed that the list represents a number that does not have leading zeros.
</li>`,
    handlerFunction: handlerAddTwoNumbers,
    starterCode: starterCodeAddTwoNumbers,
    order: 2,
    starterFunctionName: "function addTwoNumbers(",
};
