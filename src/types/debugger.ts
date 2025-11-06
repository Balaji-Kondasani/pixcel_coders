// src/types/debugger.ts
export type TraceVar = {
    name: string;
    value: string;
    type?: string;
  };
  
  export type TraceFrame = {
    step: number;
    event: "line" | "call" | "return" | "exception";
    file: string;
    funcName: string;
    line: number;
    nextLine?: number;
    locals: TraceVar[];
    globals: TraceVar[];
    stdout?: string;
    highlight?: { current: number; next?: number };
  };
  
  export type TraceRunResult =
    | { ok: true; steps: TraceFrame[] }
    | { ok: false; error: string };
  