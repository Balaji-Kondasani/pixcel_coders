// src/utils/createPyWorker.ts
export function createPyWorker(): Worker {
    const workerCode = `
      let pyodideReadyPromise;
  
      async function loadPyodideAndPackages() {
        if (pyodideReadyPromise) return pyodideReadyPromise;
        importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js");
        pyodideReadyPromise = loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/"
        });
        return pyodideReadyPromise;
      }
  
      self.onmessage = async (e) => {
        const { code } = e.data;
        try {
          const pyodide = await loadPyodideAndPackages();
  
          const pyProgram = \`
  import sys, io, traceback
  
  stdout_buf = io.StringIO()
  
  class Tracer:
      def __init__(self):
          self.frames = []
  
      def __call__(self, frame, event, arg):
          if event not in ('call', 'line', 'return', 'exception'):
              return self
          try:
              co = frame.f_code
              line = frame.f_lineno
              func = co.co_name
              gl = frame.f_globals
              lc = frame.f_locals
              rec = {
                  'event': event,
                  'file': co.co_filename,
                  'funcName': func,
                  'line': line,
                  'locals': {k: repr(v) for k, v in lc.items() if k != '__builtins__'},
                  'globals': {k: repr(v) for k, v in gl.items() if not k.startswith('__')}
              }
              self.frames.append(rec)
          except Exception as e:
              self.frames.append({
                  'event':'exception','file':'<internal>','funcName':'<tracer>',
                  'line':-1,'locals':{},'globals':{},'error':repr(e)
              })
          return self
  
  tracer = Tracer()
  old_stdout = sys.stdout
  sys.settrace(tracer)
  sys.stdout = stdout_buf
  
  globs = {}
  try:
      exec(compile(USER_CODE, "<user>", "exec"), globs, globs)
  except Exception:
      traceback.print_exc()
  finally:
      sys.settrace(None)
      sys.stdout = old_stdout
  
  out = stdout_buf.getvalue()
  frames = tracer.frames
  \`;
  
          const programWithUser = pyProgram.replace("USER_CODE", JSON.stringify(code));
          await pyodide.runPythonAsync(programWithUser);
  
          const framesProxy = pyodide.globals.get("frames");
          const outProxy = pyodide.globals.get("out");
          const frames = framesProxy.toJs();
          const stdout = outProxy.toString();
  
          const steps = frames.map((f, i) => ({
            step: i + 1,
            event: f.event,
            file: f.file,
            funcName: f.funcName,
            line: f.line,
            locals: Object.entries(f.locals || {}).map(([name, value]) => ({ name, value: String(value) })),
            globals: Object.entries(f.globals || {}).map(([name, value]) => ({ name, value: String(value) })),
            stdout,
            highlight: { current: f.line }
          }));
  
          framesProxy.destroy && framesProxy.destroy();
          outProxy.destroy && outProxy.destroy();
  
          self.postMessage({ ok: true, steps });
        } catch (err) {
          self.postMessage({ ok: false, error: String(err) });
        }
      };
    `;
  
    const blob = new Blob([workerCode], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    return new Worker(url);
  }
  