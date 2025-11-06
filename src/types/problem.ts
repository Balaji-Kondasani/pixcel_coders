export type Problem = {
	id: string;
	title: string;
	problemStatement: string;
	examples: Example[];
	constraints: string;
	handlerFunction: ((fn: any) => boolean) | string;
	starterCode: string;
	order: number;
	starterFunctionName: string;
};

export type Example = {
	id: number;
	inputText: string;
	outputText: string;
	explanation?: string;
};
