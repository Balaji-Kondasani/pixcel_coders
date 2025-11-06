// src/components/Modals/DebuggerModal.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { createPyWorker } from "../../utils/createPyWorker";
import type { TraceFrame, TraceRunResult } from "../../types/debugger";

function CodeView({ code, currentLine }: { code: string; currentLine?: number }) {
  const lines = useMemo(() => code.split("\n"), [code]);
  return (
    <div className="font-mono text-sm h-full overflow-auto bg-[#1e1e1e] text-gray-200 rounded-xl border border-gray-700">
      {lines.map((ln, i) => {
        const lineNo = i + 1;
        const active = currentLine === lineNo;
        return (
          <div
            key={i}
            className={`grid grid-cols-[56px_1fr] px-2 ${active ? "bg-yellow-900/40" : ""}`}
          >
            <div className="text-right pr-2 select-none text-gray-400">{lineNo}</div>
            <pre className="whitespace-pre-wrap leading-6">{ln || " "}</pre>
          </div>
        );
      })}
    </div>
  );
}

function VarTable({
  title,
  items,
}: {
  title: string;
  items: { name: string; value: string; type?: string }[];
}) {
  return (
    <div className="rounded-xl bg-[#0f172a] border border-slate-700 overflow-hidden">
      <div className="px-3 py-2 text-slate-200 bg-slate-800/70 font-semibold">{title}</div>
      <div className="max-h-56 overflow-auto divide-y divide-slate-800">
        {items?.length ? (
          items.map((v) => (
            <div key={v.name} className="px-3 py-2 text-slate-300">
              <div className="text-xs uppercase tracking-wider text-slate-400">{v.name}</div>
              <div className="text-sm">{v.value}</div>
            </div>
          ))
        ) : (
          <div className="px-3 py-4 text-slate-400 text-sm">(empty)</div>
        )}
      </div>
    </div>
  );
}

export default function DebuggerModal({
  open,
  onClose,
  code,
}: {
  open: boolean;
  onClose: () => void;
  code: string;
}) {
  const [steps, setSteps] = useState<TraceFrame[]>([]);
  const [idx, setIdx] = useState(0);
  const [status, setStatus] =
    useState<"idle" | "loading" | "ready" | "playing" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const current = steps[idx];

  useEffect(() => {
    if (!open) return;
    setStatus("loading");
    setError(null);

    const worker = createPyWorker();
    worker.onmessage = (e: MessageEvent<TraceRunResult>) => {
      if (e.data.ok) {
        setSteps(e.data.steps);
        setIdx(0);
        setStatus("ready");
      } else {
        setError(e.data.error || "Failed to run");
        setStatus("error");
      }
    };
    worker.postMessage({ code });

    return () => {
      worker.terminate();
      if (timerRef.current) window.clearInterval(timerRef.current);
      setStatus("idle");
      setSteps([]);
      setIdx(0);
    };
  }, [open, code]);

  const play = () => {
    if (!steps.length) return;
    setStatus("playing");
    timerRef.current = window.setInterval(() => {
      setIdx((i) => {
        const next = i + 1;
        if (next >= steps.length) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          setStatus("ready");
          return i;
        }
        return next;
      });
    }, 700);
  };

  const pause = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setStatus("ready");
  };

  const reset = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setIdx(0);
    setStatus("ready");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 20 }}
            className="w-[min(1100px,95vw)] h-[80vh] bg-[#0b1220] border border-slate-700 rounded-2xl shadow-2xl p-4 grid grid-rows-[auto_1fr_auto] gap-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="text-slate-200 text-lg font-semibold">Python Debugger</div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 text-slate-300"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="grid grid-cols-2 gap-4 overflow-hidden">
              <div className="h-full">
                <CodeView code={code} currentLine={current?.line} />
              </div>
              <div className="h-full grid grid-rows-[auto_1fr] gap-3">
                <div className="text-slate-300 text-sm">
                  Step {steps.length ? idx + 1 : 0} / {steps.length} —{" "}
                  <span className="text-slate-400">{current?.event ?? "..."}</span>
                </div>
                <div className="grid grid-rows-2 gap-3">
                  <VarTable title="Locals" items={current?.locals || []} />
                  <VarTable title="Globals / Objects" items={current?.globals || []} />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 rounded-lg bg-slate-700 text-slate-100 disabled:opacity-50"
                onClick={reset}
                disabled={!steps.length}
              >
                Start
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-slate-700 text-slate-100 disabled:opacity-50"
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                disabled={idx <= 0}
              >
                Prev Step
              </button>
              {status !== "playing" ? (
                <button
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50"
                  onClick={play}
                  disabled={!steps.length}
                >
                  Play
                </button>
              ) : (
                <button
                  className="px-3 py-2 rounded-lg bg-amber-600 text-white"
                  onClick={pause}
                >
                  Pause
                </button>
              )}
              <button
                className="px-3 py-2 rounded-lg bg-slate-700 text-slate-100 disabled:opacity-50"
                onClick={() => setIdx((i) => Math.min(steps.length - 1, i + 1))}
                disabled={idx >= steps.length - 1}
              >
                Next Step
              </button>
              <div className="ml-auto text-slate-400 text-sm">
                {current?.stdout ? "stdout captured" : ""}
              </div>
            </div>

            {/* Overlays */}
            {status === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-4 py-3 rounded-xl bg-slate-800 text-slate-200"
                >
                  Loading Python…
                </motion.div>
              </div>
            )}
            {status === "error" && (
              <div className="absolute inset-x-4 bottom-4 p-3 rounded-xl bg-red-900/40 border border-red-800 text-red-100 text-sm">
                {error}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
