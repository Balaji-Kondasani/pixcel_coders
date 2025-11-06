import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { mockProblems } from '../../MockProblems/problems';
import type { Problem } from '../../MockProblems/problems';
import ProblemPageNavbar from '../../components/Workspace/ProblemPageNavbar';
import ProblemWorkspace from '../../components/Workspace/ProblemWorkspace';
import { TestResult } from '../../components/Workspace/TestcaseSection';

const ProblemPage: React.FC = () => {
    const router = useRouter();
    const { pid } = router.query;
    const [problem, setProblem] = useState<Problem | null>(null);

    // SEPARATED STATE: One for 'Run', one for 'Submit'
    const [runResult, setRunResult] = useState<TestResult | null>(null);
    const [submissionResult, setSubmissionResult] = useState<TestResult | null>(null);
    
    const [isLoadingRun, setIsLoadingRun] = useState<boolean>(false);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
    const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
    const [userCode, setUserCode] = useState<string>("");

    const [leftPaneView, setLeftPaneView] = useState<'description' | 'submissions'>('description');
    const [timeComplexity, setTimeComplexity] = useState<string | null>(null);

    // --- Timer State ---
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [timerHasStarted, setTimerHasStarted] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (pid) {
            const foundProblem = mockProblems.find(p => p.titleId === pid as string);
            if (foundProblem) {
                setProblem(foundProblem);
                setUserCode(foundProblem.starterCode);
            }
        }
    }, [pid]);

    const handleRun = async () => {
        if (!problem) return;
        setIsLoadingRun(true);
        setRunResult(null);

        const currentCase = problem.examples[activeTestCaseId];
        
        try {
            const response = await fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: userCode, language: "python", input: currentCase.inputText, problemId: problem.titleId }),
            });
            const result = await response.json();
            const output = result.output ? result.output.trim() : "";
            const expectedOutput = currentCase.outputText.trim();

            if (result.status === 'Accepted' && output === expectedOutput) {
                setRunResult({ status: "Accepted", output: result.output });
            } else {
                setRunResult({ status: "Wrong Answer", output: result.output || result.message });
            }
        } catch (error: any) {
            setRunResult({ status: "Error", output: error.message });
        } finally {
            setIsLoadingRun(false);
        }
    };

    const handleSubmit = async () => {
        if (!problem) return;
        setIsLoadingSubmit(true);
        setSubmissionResult(null);
        setTimeComplexity(null);
        setLeftPaneView('submissions'); // Immediately switch to submission view
        
        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: userCode, language: "python", problemId: problem.titleId }),
            });
            const result = await response.json();
            setSubmissionResult(result);

            if (result.status === "Accepted") {
                const analysisRes = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: userCode }),
                });
                const analysisResult = await analysisRes.json();
                setTimeComplexity(analysisResult.complexity);
            }
        } catch (error: any) {
            setSubmissionResult({ status: "Error", output: error.message });
        } finally {
            setIsLoadingSubmit(false);
        }
    };

    // --- Timer Logic ---
    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isActive]);

    const onTimerStart = () => { setIsActive(true); setTimerHasStarted(true); };
    const onTimerStop = () => setIsActive(false);
    const onTimerReset = () => { setIsActive(false); setTimerHasStarted(false); setSeconds(0); };

    if (!problem) {
        return <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white"><p>Loading...</p></div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 font-sans text-white">
            <ProblemPageNavbar 
                timerHasStarted={timerHasStarted}
                timerIsActive={isActive}
                seconds={seconds}
                onTimerStart={onTimerStart}
                onTimerStop={onTimerStop}
                onTimerReset={onTimerReset}
            />
            <ProblemWorkspace
                problem={problem}
                runResult={runResult}
                submissionResult={submissionResult}
                isLoadingRun={isLoadingRun}
                isLoadingSubmit={isLoadingSubmit}
                activeTestCaseId={activeTestCaseId}
                setActiveTestCaseId={setActiveTestCaseId}
                userCode={userCode}
                setUserCode={setUserCode}
                onRun={handleRun}
                onSubmit={handleSubmit}
                leftPaneView={leftPaneView}
                setLeftPaneView={setLeftPaneView}
                timeComplexity={timeComplexity}
            />
        </div>
    );
};

export default ProblemPage;
