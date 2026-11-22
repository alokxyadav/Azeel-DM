
"use client";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={28} className="text-red-600"/>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          An unexpected error occurred. If this persists, contact support@azeeldm.com
        </p>
        {error.digest && <p className="text-xs text-slate-400 font-mono mb-6 bg-slate-100 px-3 py-2 rounded-lg">Error ID: {error.digest}</p>}
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn btn-brand" style={{boxShadow:"0 4px 14px rgba(79,70,229,.35)"}}>
            <RefreshCw size={15}/>Try Again
          </button>
          <a href="/" className="btn btn-outline">Go Home</a>
        </div>
      </div>
    </div>
  );
}
