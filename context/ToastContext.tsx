"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Info, Sparkles } from "lucide-react";

export type ToastVariant = "success" | "info" | "celebrate";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 items-center pointer-events-none w-full max-w-md px-4"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className={`pointer-events-auto w-full px-5 py-3 rounded-xl card-shadow text-sm font-medium flex items-center gap-2 shadow-lg ${
                toast.variant === "celebrate"
                  ? "bg-amber-600 text-white"
                  : toast.variant === "info"
                    ? "bg-white text-bread-charcoal border border-bread-brown/15"
                    : "bg-bread-brown text-white"
              }`}
              role="status"
            >
              {toast.variant === "celebrate" ? (
                <Sparkles className="w-4 h-4 flex-shrink-0" />
              ) : toast.variant === "info" ? (
                <Info className="w-4 h-4 flex-shrink-0 text-bread-brown" />
              ) : (
                <Check className="w-4 h-4 flex-shrink-0" />
              )}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
