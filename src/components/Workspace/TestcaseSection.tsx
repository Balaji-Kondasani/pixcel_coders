import React from 'react';
import { ChevronUp, CheckCircle, XCircle } from 'lucide-react';
import type { Problem } from '../../MockProblems/problems';

export type TestResult = {
    status: 'Accepted' | 'Wrong Answer' | 'Error' | null;
    output: string | null;
    time?: string;
    memory?: number;
};

interface TestcaseSectionProps {
    problem: Problem;
    runResult: TestResult | null;
    isLoadingRun: boolean;
    isLoadingSubmit: boolean;
    activeTestCaseId: number;
    setActiveTestCaseId: (id: number) => void;
    onRun: () => void;
    onSubmit: () => void;
}

const TestcaseSection: React.FC<TestcaseSectionProps> = ({
    problem,
    runResult,
    isLoadingRun,
    isLoadingSubmit,
    activeTestCaseId,
    setActiveTestCaseId,
    onRun,
    onSubmit,
}) => {
    const activeCaseData = problem.examples[activeTestCaseId];

    const renderContent = () => {
        if (isLoadingRun) {
            return (
                <div className="p-4 space-y-4 animate-pulse">
                    <div className="flex space-x-2">
                        <div className="h-8 w-24 bg-slate-800 rounded-md"></div>
                        <div className="h-8 w-24 bg-slate-800 rounded-md"></div>
                        <div className="h-8 w-24 bg-slate-800 rounded-md"></div>
                    </div>
                    <div className="h-6 w-1/4 bg-slate-700 rounded-md mt-6"></div>
                    <div className="h-10 w-full bg-slate-800 rounded-md"></div>
                    <div className="h-6 w-1/4 bg-slate-700 rounded-md mt-4"></div>
                    <div className="h-10 w-full bg-slate-800 rounded-md"></div>
                </div>
            );
        }

        if (runResult) {
            return (
                <div className='p-4 animate-fade-in'>
                    <div className={`flex items-center space-x-2 font-semibold text-xl ${runResult.status === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>
                        {runResult.status === 'Accepted' ? <CheckCircle size={24}/> : <XCircle size={24}/>}
                        <span>{runResult.status}</span>
                    </div>
                    <div className="mt-4">
                        <div className='font-semibold my-2'>
                            <p className='text-sm font-medium text-slate-400'>Input:</p>
                            <div className='w-full cursor-text rounded-lg border px-3 py-2 bg-slate-800 border-transparent text-white mt-1 font-mono text-xs'>
                                {activeCaseData.inputText}
                            </div>
                        </div>
                        <div className='font-semibold my-2'>
                            <p className='text-sm font-medium text-slate-400'>Output:</p>
                            <div className='w-full cursor-text rounded-lg border px-3 py-2 bg-slate-800 border-transparent text-white mt-1 font-mono text-xs'>
                                {runResult.output || "No output"}
                            </div>
                        </div>
                        <div className='font-semibold my-2'>
                            <p className='text-sm font-medium text-slate-400'>Expected:</p>
                            <div className='w-full cursor-text rounded-lg border px-3 py-2 bg-slate-800 border-transparent text-white mt-1 font-mono text-xs'>
                                {activeCaseData.outputText}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="p-4">
                <div className='flex'>
                    {problem.examples.map((example, index) => (
                        <div className='mr-2 items-start mt-2' key={example.id} onClick={() => setActiveTestCaseId(index)}>
                            <div className={`font-medium items-center transition-all focus:outline-none inline-flex bg-slate-800 hover:bg-slate-700 relative rounded-md px-4 py-1 cursor-pointer whitespace-nowrap ${activeTestCaseId === index ? "text-white bg-slate-700" : "text-slate-400"}`}>
                                Case {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='font-semibold my-4'>
                    <p className='text-sm font-medium mt-4 text-white'>Input:</p>
                    <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-slate-800 border-transparent text-white mt-2 font-mono text-xs'>
                        {activeCaseData.inputText}
                    </div>
                    <p className='text-sm font-medium mt-4 text-white'>Output:</p>
                    <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-slate-800 border-transparent text-white mt-2 font-mono text-xs'>
                        {activeCaseData.outputText}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-slate-900 rounded-lg h-full flex flex-col">
            <div className="flex-shrink-0 p-3 bg-slate-800/50 border-b border-slate-700 flex items-center space-x-4">
                <div className={`font-medium py-1 px-3 rounded-md text-white bg-slate-700`}>
                    Testcase
                </div>
            </div>
            <div className="flex-grow overflow-y-auto">
                {renderContent()}
            </div>
            <div className="flex-shrink-0 p-3 bg-slate-800/50 border-t border-slate-700 flex items-center space-x-4">
                <button className="text-sm flex items-center space-x-2 text-slate-400 hover:text-white">
                    <ChevronUp size={16} />
                    <span>Console</span>
                </button>
                <div className="flex-grow"></div>
                <button
                    onClick={onRun}
                    className='px-4 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-white bg-slate-700 hover:bg-slate-600 rounded-lg disabled:opacity-50'
                    disabled={isLoadingRun || isLoadingSubmit}
                >
                    Run
                </button>
                <button
                    onClick={onSubmit}
                    className='px-4 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-white bg-green-600 hover:bg-green-500 rounded-lg disabled:opacity-50'
                    disabled={isLoadingRun || isLoadingSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default TestcaseSection;
