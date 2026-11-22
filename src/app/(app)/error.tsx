
"use client";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-sm p-8">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-600"/>
        </div>
        <h2 className="text-lg font-black text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-slate-500 text-sm mb-5">Please try again. If the issue persists, contact support.</p>
        <button onClick={reset} className="btn btn-brand btn-sm" style={{boxShadow:"0 4px 14px rgba(79,70,229,.35)"}}>
          <RefreshCw size={14}/>Try Again
        </button>
      </div>
    </div>
  );
}
