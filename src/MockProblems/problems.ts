// src/MockProblems/problems.ts

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
  problemStatement: string; 
  examples: { id: number; inputText: string; outputText: string; explanation?: string; }[];
  constraints: string;
  starterCode: string; // This property is required
}


// --- Mock Problems Data (Fully Updated for Python) ---

export const mockProblems: Problem[] = [
  { 
      id: 1, 
      title: '1. Two Sum', 
      titleId: 'two-sum', 
      difficulty: 'Easy', 
      category: 'Array', 
      acceptance: 56.1, 
      status: 'Solved', 
      isPremium: false, 
      videoUrl: 'https://www.youtube.com/watch?v=KLlXCFG5TnA',
      problemStatement: `<p class='mt-3'>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to</em> <code>target</code>.</p><p class='mt-3'>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use thesame element twice.</p><p class='mt-3'>You can return the answer in any order.</p>`,
      examples: [
          { id: 1, inputText: "nums = [2,7,11,15], target = 9", outputText: "[0,1]" },
          { id: 2, inputText: "nums = [3,2,4], target = 6", outputText: "[1,2]" },
          { id: 3, inputText: "nums = [3,3], target = 6", outputText: "[0,1]" },
      ],
      constraints: `<li class='mt-2'><code>2 ≤ nums.length ≤ 10^4</code></li><li class='mt-2'><code>-10^9 ≤ nums[i] ≤ 10^9</code></li><li class='mt-2'><code>-10^9 ≤ target ≤ 10^9</code></li><li class='mt-2'><strong>Only one valid answer exists.</strong></li>`,
      starterCode: 
`from typing import List

class Solution:
  def twoSum(self, nums: List[int], target: int) -> List[int]:
      # Your Python code here
      # Return a list of two indices
      pass
`
  },
  { 
      id: 2, 
      title: '2. Add Two Numbers', 
      titleId: 'add-two-numbers', 
      difficulty: 'Medium', 
      category: 'Linked List', 
      acceptance: 46.7, 
      status: 'Unsolved', 
      isPremium: false, 
      videoUrl: 'https://www.youtube.com/watch?v=wgFPrzT-uQw',
      problemStatement: `<p class='mt-3'>You are given two <strong>non-empty</strong> linked lists representing two non-negative integers. The digits are stored in <strong>reverse order</strong>, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.</p><p class='mt-3'>You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>`,
      examples: [
          { id: 1, inputText: "l1 = [2,4,3], l2 = [5,6,4]", outputText: "[7,0,8]" },
          { id: 2, inputText: "l1 = [0], l2 = [0]", outputText: "[0]" },
          { id: 3, inputText: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]", outputText: "[8,9,9,9,0,0,0,1]" },
      ],
      constraints: `<li class='mt-2'>The number of nodes in each linked list is in the range <code>[1, 100]</code>.</li><li class='mt-2'><code>0 <= Node.val <= 9</code></li><li class='mt-2'>It is guaranteed that the list represents a number that does not have leading zeros.</li>`,
      starterCode: 
`from typing import Optional

# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
  def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
      # Your Python code here
      # Return the head of the result linked list
      pass
`
  },
  {
      id: 3,
      title: "3. Jump Game",
      titleId: "jump-game",
      difficulty: "Medium",
      category: "Array",
      acceptance: 45.8,
      status: "Unsolved",
      isPremium: false,
      problemStatement: `<p class='mt-3'>You are given an integer array <code>nums</code>. You are initially positioned at the array's <strong>first index</strong>, and each element in the array represents your maximum jump length at that position.</p><p class='mt-3'>Return <code>true</code> if you can reach the last index, or <code>false</code> otherwise.</p>`,
      examples: [
          { id: 1, inputText: "nums = [2,3,1,1,4]", outputText: "true" },
          { id: 2, inputText: "nums = [3,2,1,0,4]", outputText: "false" },
      ],
      constraints: `<li class='mt-2'><code>1 <= nums.length <= 10^4</code></li><li class='mt-2'><code>0 <= nums[i] <= 10^5</code></li>`,
      starterCode: 
`from typing import List

class Solution:
  def canJump(self, nums: List[int]) -> bool:
      # Your Python code here
      # Return true or false
      pass
`
  },
  {
      id: 4,
      title: "4. Search a 2D Matrix",
      titleId: "search-a-2d-matrix",
      difficulty: "Medium",
      category: "Binary Search",
      acceptance: 49.2,
      status: "Unsolved",
      isPremium: false,
      problemStatement: `<p class='mt-3'>Write an efficient algorithm that searches for a value <code>target</code> in an <code>m x n</code> integer matrix <code>matrix</code>. This matrix has the following properties:</p><ul class='mt-3 list-disc pl-5'><li>Integers in each row are sorted from left to right.</li><li>The first integer of each row is greater than the last integer of the previous row.</li></ul>`,
      examples: [
          { id: 1, inputText: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", outputText: "true" },
          { id: 2, inputText: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13", outputText: "false" },
      ],
      constraints: `<li class='mt-2'><code>m == matrix.length</code></li><li class='mt-2'><code>n == matrix[i].length</code></li><li class='mt-2'><code>1 <= m, n <= 100</code></li><li class='mt-2'><code>-10^4 <= matrix[i][j], target <= 10^4</code></li>`,
      starterCode: 
`from typing import List

class Solution:
  def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
      # Your Python code here
      # Return true or false
      pass
`
  },
  {
      id: 5,
      title: "5. Container With Most Water",
      titleId: "container-with-most-water",
      difficulty: "Medium",
      category: "Two Pointers",
      acceptance: 54.3,
      status: "Unsolved",
      isPremium: false,
      problemStatement: `<p class='mt-3'>You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i-th</code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.</p><p class='mt-3'>Find two lines that together with the x-axis form a container, such that the container contains the most water.</p><p class='mt-3'>Return <em>the maximum amount of water a container can store</em>.</p>`,
      examples: [
          { id: 1, inputText: "height = [1,8,6,2,5,4,8,3,7]", outputText: "49" },
          { id: 2, inputText: "height = [1,1]", outputText: "1" },
      ],
      constraints: `<li class='mt-2'><code>n == height.length</code></li><li class='mt-2'><code>2 <= n <= 10^5</code></li><li class='mt-2'><code>0 <= height[i] <= 10^4</code></li>`,
      starterCode: 
`from typing import List

class Solution:
  def maxArea(self, height: List[int]) -> int:
      # Your Python code here
      # Return an integer
      pass
`
  },
  {
      id: 6,
      title: "6. Merge Intervals",
      titleId: "merge-intervals",
      difficulty: "Medium",
      category: "Array",
      acceptance: 45.1,
      status: "Unsolved",
      isPremium: false,
      problemStatement: `<p class='mt-3'>Given an array of <code>intervals</code> where <code>intervals[i] = [start_i, end_i]</code>, merge all overlapping intervals, and return <em>an array of the non-overlapping intervals that cover all the intervals in the input</em>.</p>`,
      examples: [
          { id: 1, inputText: "intervals = [[1,3],[2,6],[8,10],[15,18]]", outputText: "[[1,6],[8,10],[15,18]]" },
          { id: 2, inputText: "intervals = [[1,4],[4,5]]", outputText: "[[1,5]]" },
      ],
      constraints: `<li class='mt-2'><code>1 <= intervals.length <= 10^4</code></li><li class='mt-2'><code>intervals[i].length == 2</code></li><li class='mt-2'><code>0 <= start_i <= end_i <= 10^4</code></li>`,
      starterCode: 
`from typing import List

class Solution:
  def merge(self, intervals: List[List[int]]) -> List[List[int]]:
      # Your Python code here
      # Return a list of lists
      pass
`
  },
  {
      id: 7,
      title: "7. Maximum Subarray",
      titleId: "maximum-subarray",
      difficulty: "Easy",
      category: "Dynamic Programming",
      acceptance: 50.3,
      status: "Unsolved",
      isPremium: false,
      problemStatement: `<p class='mt-3'>Given an integer array <code>nums</code>, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.</p>`,
      examples: [
          { id: 1, inputText: "nums = [-2,1,-3,4,-1,2,1,-5,4]", outputText: "6" },
          { id: 2, inputText: "nums = [1]", outputText: "1" },
          { id: 3, inputText: "nums = [5,4,-1,7,8]", outputText: "23" },
      ],
      constraints: `<li class='mt-2'><code>1 <= nums.length <= 10^5</code></li><li class='mt-2'><code>-10^4 <= nums[i] <= 10^4</code></li>`,
      starterCode: 
`from typing import List

class Solution:
  def maxSubArray(self, nums: List[int]) -> int:
      # Your Python code here
      # Return an integer
      pass
`
  },
  {
      id: 8,
      title: "8. Valid Parentheses",
      titleId: "valid-parentheses",
      difficulty: "Easy",
      category: "Stack",
      acceptance: 40.6,
      status: "Unsolved",
      isPremium: false,
      problemStatement: `<p class='mt-3'>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p><p class='mt-3'>An input string is valid if:</p><ul class='mt-3 list-disc pl-5'><li>Open brackets must be closed by the same type of brackets.</li><li>Open brackets must be closed in the correct order.</li></ul>`,
      examples: [
          { id: 1, inputText: 's = "()"', outputText: "true" },
          { id: 2, inputText: 's = "()[]{}"', outputText: "true" },
          { id: 3, inputText: 's = "(]"', outputText: "false" },
      ],
      constraints: `<li class='mt-2'><code>1 <= s.length <= 10^4</code></li><li class='mt-2'><code>s</code> consists of parentheses only <code>'()[]{}'</code>.</li>`,
      starterCode: 
`class Solution:
  def isValid(self, s: str) -> bool:
      # Your Python code here
      # Return true or false
      pass
`
  }
];
