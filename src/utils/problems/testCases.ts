interface TestCase {
    inputText: string;
    outputText: string;
}

interface ProblemTests {
    [key: string]: {
        hiddenCases: TestCase[];
    };
}

// The key MUST match the 'titleId' from your mockProblems file.
export const testCases: ProblemTests = {
    "two-sum": {
        hiddenCases: [
            { inputText: "nums = [3,3], target = 6", outputText: "[0,1]" },
            { inputText: "nums = [-1,-5,10,15], target = 9", outputText: "[0,2]" },
            { inputText: "nums = [1,2,3,4,5], target = 9", outputText: "[3,4]" },
        ],
    },
    "add-two-numbers": {
        hiddenCases: [
            { inputText: "l1 = [0], l2 = [0]", outputText: "[0]" },
            { inputText: "l1 = [9,9,9], l2 = [1]", outputText: "[0,0,0,1]" },
            { inputText: "l1 = [1,0,0,0,0,0,1], l2 = [5,6,4]", outputText: "[6,6,4,0,0,0,1]" },
        ],
    },
    "jump-game": {
        hiddenCases: [
            { inputText: "nums = [0]", outputText: "true" },
            { inputText: "nums = [2,0,0]", outputText: "true" },
            { inputText: "nums = [2,5,0,0]", outputText: "true" },
        ],
    },
    "search-a-2d-matrix": {
        hiddenCases: [
            { inputText: "matrix = [[1]], target = 1", outputText: "true" },
            { inputText: "matrix = [[1,3,5]], target = 4", outputText: "false" },
            { inputText: "matrix = [[10,20],[30,40]], target = 35", outputText: "false" },
        ],
    },
    "container-with-most-water": {
        hiddenCases: [
            { inputText: "height = [1,1]", outputText: "1" },
            { inputText: "height = [4,3,2,1,4]", outputText: "16" },
            { inputText: "height = [1,2,1]", outputText: "2" },
        ],
    },
    "merge-intervals": {
        hiddenCases: [
            { inputText: "intervals = [[1,4],[4,5]]", outputText: "[[1,5]]" },
            { inputText: "intervals = [[1,4],[2,3]]", outputText: "[[1,4]]" },
            { inputText: "intervals = [[1,10]]", outputText: "[[1,10]]" },
        ],
    },
    "maximum-subarray": {
        hiddenCases: [
            { inputText: "nums = [1]", outputText: "1" },
            { inputText: "nums = [5,4,-1,7,8]", outputText: "23" },
            { inputText: "nums = [-1]", outputText: "-1" },
        ],
    },
    "valid-parentheses": {
        hiddenCases: [
            { inputText: 's = "{[]}"', outputText: "true" },
            { inputText: 's = "([)]"', outputText: "false" },
            { inputText: 's = "["', outputText: "false" },
        ],
    },
};
