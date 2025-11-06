// src/utils/problems/driver.ts

// This function now generates Python code to run the user's solution.
export function generateDriverCode(problemId: string, userCode: string, input: string): string {
    let driverSetup = "";
    let functionCall = "";
    
    // The user's code will be a class `Solution` with a method.
    // We need to instantiate the class and call the method.
    const solutionInstance = "solution = Solution()";

    switch (problemId) {
        case "two-sum":
            driverSetup = `
import json
parts = input_str.split(', target = ')
nums = json.loads(parts[0].replace('nums = ', ''))
target = int(parts[1])
`;
            // CORRECTED: Use json.dumps with separators to remove whitespace for a perfect match.
            functionCall = `result = solution.twoSum(nums, target)\nprint(json.dumps(sorted(result), separators=(',', ':')))`;
            break;

        case "add-two-numbers":
            driverSetup = `
import json
# In a real system, you'd convert these lists to ListNode objects.
# For this project, we'll simulate by assuming the function works with lists.
parts = input_str.split(', l2 = ')
l1_list = json.loads(parts[0].replace('l1 = ', ''))
l2_list = json.loads(parts[1])
`;
            // CORRECTED: Use json.dumps for consistent array formatting.
            functionCall = `result = solution.addTwoNumbers(l1_list, l2_list)\nprint(json.dumps(result, separators=(',', ':')) if isinstance(result, list) else result)`;
            break;
        
        case "jump-game":
            driverSetup = `
import json
nums = json.loads(input_str.replace('nums = ', ''))
`;
            functionCall = `result = solution.canJump(nums)\nprint(str(result).lower()) # Output 'true' or 'false'`;
            break;

        case "search-a-2d-matrix":
            driverSetup = `
import json
parts = input_str.split(', target = ')
matrix = json.loads(parts[0].replace('matrix = ', ''))
target = int(parts[1])
`;
            functionCall = `result = solution.searchMatrix(matrix, target)\nprint(str(result).lower())`;
            break;

        case "container-with-most-water":
            driverSetup = `
import json
height = json.loads(input_str.replace('height = ', ''))
`;
            functionCall = `result = solution.maxArea(height)\nprint(result)`;
            break;

        case "merge-intervals":
            driverSetup = `
import json
intervals = json.loads(input_str.replace('intervals = ', ''))
`;
            // CORRECTED: Use json.dumps for consistent array formatting.
            functionCall = `result = solution.merge(intervals)\nprint(json.dumps(result, separators=(',', ':')))`;
            break;

        case "maximum-subarray":
            driverSetup = `
import json
nums = json.loads(input_str.replace('nums = ', ''))
`;
            functionCall = `result = solution.maxSubArray(nums)\nprint(result)`;
            break;

        case "valid-parentheses":
            // CORRECTED: Properly extract the string value without causing a syntax error.
            driverSetup = `
s = input_str.split(' = ')[1].strip('"')
`;
            functionCall = `result = solution.isValid(s)\nprint(str(result).lower())`;
            break;
        
        default:
            driverSetup = `import json`
            functionCall = `print("Driver for this problem is not implemented yet.")`
            break;
    }

    // Combine the user's code with our Python driver code.
    const finalCode = `
from typing import List, Optional

# Definition for singly-linked list (if needed by problems).
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

${userCode}

input_str = """${input}"""
${driverSetup}
${solutionInstance}
${functionCall}
`;
    // CORRECTED: The faulty .trimStart() logic has been removed.
    // We just trim the entire block once to remove leading/trailing newlines.
    return finalCode.trim();
}