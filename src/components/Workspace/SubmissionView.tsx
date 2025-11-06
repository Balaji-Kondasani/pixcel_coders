import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TestResult } from './TestcaseSection';
import { Loader2, XCircle } from 'lucide-react';

interface SubmissionViewProps {
    submissionResult: TestResult | null;
    isLoadingSubmit: boolean;
    timeComplexity: string | null;
    setLeftPaneView: (view: 'description' | 'submissions') => void;
}

// Mock data for the chart
const generateChartData = (runtimeMs: number) => {
    const data = [];
    for (let i = 0; i < 30; i++) {
        const value = Math.random() * 80 + 10;
        data.push({ name: `Sub ${i}`, time: value });
    }
    data.push({ name: 'Your', time: runtimeMs });
    return data.sort(() => Math.random() - 0.5);
};


const SubmissionView: React.FC<SubmissionViewProps> = ({ submissionResult, isLoadingSubmit, timeComplexity, setLeftPaneView }) => {
    
    if (isLoadingSubmit) {
        return (
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 h-full text-white animate-pulse">
                 <div className="h-8 w-3/4 bg-slate-700 rounded-md mb-4"></div>
                 <div className="h-4 w-1/2 bg-slate-800 rounded-md mb-8"></div>
                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-800 p-4 rounded-lg h-24"></div>
                    <div className="bg-slate-800 p-4 rounded-lg h-24"></div>
                 </div>
                 <div className="h-48 w-full bg-slate-800 rounded-md mb-8"></div>
                 <div className="bg-slate-800 p-4 rounded-lg h-20"></div>
            </div>
        );
    }

    if (!submissionResult) {
        return (
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 h-full flex flex-col items-center justify-center text-white">
                <h2 className="text-xl font-semibold mb-4">Submission Analysis</h2>
                <p className="text-slate-400 text-center">
                    Submit your solution to view a detailed performance analysis and time complexity breakdown.
                </p>
                 <button 
                    onClick={() => setLeftPaneView('description')}
                    className="mt-6 text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-md transition-colors"
                >
                    Back to Description
                </button>
            </div>
        );
    }

    if (submissionResult.status !== 'Accepted') {
        return (
           <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 h-full flex flex-col items-center justify-center text-white">
               <XCircle className="h-16 w-16 text-red-500 mb-4" />
               <h2 className="text-2xl font-bold text-red-400 mb-2">{submissionResult.status}</h2>
               <p className="text-slate-400 text-center mb-4">Your solution failed on one or more hidden test cases.</p>
               <div className='w-full text-left font-semibold my-2'>
                   <p className='text-sm font-medium text-slate-400'>Failure Details:</p>
                   <div className='w-full cursor-text rounded-lg border p-3 bg-slate-800 border-transparent text-white mt-1 font-mono text-xs'>
                       {submissionResult.output}
                   </div>
               </div>
                <button 
                   onClick={() => setLeftPaneView('description')}
                   className="mt-6 text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-md transition-colors"
               >
                   Back to Description
               </button>
           </div>
       );
   }

    const runtimeMs = submissionResult.time ? parseFloat(submissionResult.time) * 1000 : 0;
    const chartData = generateChartData(runtimeMs);
    const beatsPercentage = ((chartData.filter(d => d.time > runtimeMs).length / chartData.length) * 100).toFixed(2);

    return (
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 h-full overflow-y-auto text-white">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-green-400">Accepted</h1>
                <button 
                    onClick={() => setLeftPaneView('description')}
                    className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-md transition-colors"
                >
                    Back to Description
                </button>
            </div>
            <p className="text-sm text-slate-400 mb-6">Submitted a few seconds ago</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-800 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">Runtime</p>
                    <p className="text-2xl font-bold">{runtimeMs} <span className="text-lg text-slate-400">ms</span></p>
                    <p className="text-sm text-green-400">Beats {beatsPercentage}%</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">Memory</p>
                    <p className="text-2xl font-bold">{submissionResult.memory} <span className="text-lg text-slate-400">KB</span></p>
                    <p className="text-sm text-slate-400">Beats 45.12%</p>
                </div>
            </div>

            <div className="h-48 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="name" tick={{ fill: '#64748b' }} fontSize={12} />
                        <YAxis tick={{ fill: '#64748b' }} fontSize={12} />
                        <Tooltip 
                            cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#cbd5e1' }}
                        />
                        <Bar dataKey="time" barSize={10}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.name === 'Your' ? '#34d399' : '#38bdf8'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">Complexity Analysis</h2>
                {timeComplexity ? (
                    <div className="bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-slate-400">Time Complexity</p>
                        <p className="text-2xl font-mono font-bold">{timeComplexity}</p>
                    </div>
                ) : (
                    <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-center">
                        <Loader2 className="animate-spin h-6 w-6 text-slate-400 mr-2" />
                        <span className="text-slate-400">Analyzing complexity...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmissionView;
