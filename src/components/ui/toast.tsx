
"use client";
import { useEffect, useState, createContext, useContext, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";
interface Toast { id: string; type: ToastType; title: string; desc?: string; }
type ToastFn = (title: string, desc?: string) => void;
interface ToastCtx { success: ToastFn; error: ToastFn; warning: ToastFn; info: ToastFn; }

const Ctx = createContext<ToastCtx>({
  success: () => {}, error: () => {}, warning: () => {}, info: () => {},
});

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertCircle,
  info:    Info,
};
const STYLES: Record<ToastType, string> = {
  success: "bg-white border-green-200 shadow-lg",
  error:   "bg-white border-red-200 shadow-lg",
  warning: "bg-white border-yellow-200 shadow-lg",
  info:    "bg-white border-indigo-200 shadow-lg",
};
const ICON_CLS: Record<ToastType, string> = {
  success: "text-green-500",
  error:   "text-red-500",
  warning: "text-yellow-500",
  info:    "text-indigo-500",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const add = useCallback((type: ToastType, title: string, desc?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, type, title, desc }]);
    timers.current[id] = setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== id));
    }, 4000);
  }, []);

  const remove = useCallback((id: string) => {
    clearTimeout(timers.current[id]);
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const ctx: ToastCtx = {
    success: (t, d) => add("success", t, d),
    error:   (t, d) => add("error",   t, d),
    warning: (t, d) => add("warning", t, d),
    info:    (t, d) => add("info",    t, d),
  };

  return (
    <Ctx.Provider value={ctx}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 360 }}>
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = ICONS[t.type];
            return (
              <motion.div key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                exit  ={{ opacity: 0, y: 16, scale: 0.95 }}
                transition={{ duration: 0.22 }}
                className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border ${STYLES[t.type]}`}>
                <Icon size={17} className={`shrink-0 mt-0.5 ${ICON_CLS[t.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{t.title}</p>
                  {t.desc && <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>}
                </div>
                <button onClick={() => remove(t.id)} className="shrink-0 text-slate-400 hover:text-slate-600 mt-0.5 p-0.5">
                  <X size={13} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
