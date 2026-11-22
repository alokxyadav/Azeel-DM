
"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

interface Props {
  open:      boolean;
  title:     string;
  desc?:     string;
  confirmLabel?: string;
  danger?:   boolean;
  onConfirm: () => void;
  onCancel:  () => void;
  loading?:  boolean;
}

export function ConfirmModal({ open, title, desc, confirmLabel = "Confirm", danger, onConfirm, onCancel, loading }: Props) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    if (open) document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40" onClick={onCancel} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit  ={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex items-start gap-4">
              {danger && (
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} className="text-red-600" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                {desc && <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>}
              </div>
              <button onClick={onCancel} className="btn btn-ghost btn-icon-sm shrink-0"><X size={15}/></button>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={onCancel} className="btn btn-outline btn-sm">Cancel</button>
              <button onClick={onConfirm} disabled={loading}
                className={`btn btn-sm ${danger ? "btn-danger" : "btn-brand"} disabled:opacity-50`}>
                {loading
                  ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin"/>
                  : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
