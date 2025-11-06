import React from 'react';
import Split from 'react-split';
import type { Problem } from '../../MockProblems/problems';
import ProblemDescription from './ProblemDescription';
import CodeEditor from './CodeEditor';
import TestcaseSection, { TestResult } from './TestcaseSection';
import SubmissionView from './SubmissionView';

interface ProblemWorkspaceProps {
    problem: Problem;
    runResult: TestResult | null;
    submissionResult: TestResult | null;
    isLoadingRun: boolean;
    isLoadingSubmit: boolean;
    activeTestCaseId: number;
    setActiveTestCaseId: (id: number) => void;
    userCode: string;
    setUserCode: (code: string) => void;
    onRun: () => void;
    onSubmit: () => void;
    leftPaneView: 'description' | 'submissions';
    setLeftPaneView: (view: 'description' | 'submissions') => void;
    timeComplexity: string | null;
}

const ProblemWorkspace: React.FC<ProblemWorkspaceProps> = ({
    problem,
    runResult,
    submissionResult,
    isLoadingRun,
    isLoadingSubmit,
    activeTestCaseId,
    setActiveTestCaseId,
    userCode,
    setUserCode,
    onRun,
    onSubmit,
    leftPaneView,
    setLeftPaneView,
    timeComplexity,
}) => {
    return (
        <main className="pt-20 h-[calc(100vh-5rem)]">
            <Split className="split h-full" minSize={0} gutterSize={10}>
                {/* Left Pane */}
                <div className="h-full overflow-y-auto">
                    {leftPaneView === 'description' ? (
                        <ProblemDescription problem={problem} setLeftPaneView={setLeftPaneView} />
                    ) : (
                        <SubmissionView 
                            submissionResult={submissionResult} 
                            isLoadingSubmit={isLoadingSubmit}
                            timeComplexity={timeComplexity}
                            setLeftPaneView={setLeftPaneView}
                        />
                    )}
                </div>

                {/* Right Pane */}
                <div className="h-full">
                    <Split className="split-vertical h-full" direction="vertical" sizes={[60, 40]} minSize={100}>
                        <div className="h-full overflow-hidden">
                            <CodeEditor
                                value={userCode}
                                onChange={setUserCode}
                                language="Python"
                            />
                        </div>
                        <div className="h-full overflow-hidden">
                            <TestcaseSection
                                problem={problem}
                                runResult={runResult}
                                isLoadingRun={isLoadingRun}
                                isLoadingSubmit={isLoadingSubmit}
                                activeTestCaseId={activeTestCaseId}
                                setActiveTestCaseId={setActiveTestCaseId}
                                onRun={onRun}
                                onSubmit={onSubmit}
                            />
                        </div>
                    </Split>
                </div>
            </Split>
        </main>
    );
};

export default ProblemWorkspace;
