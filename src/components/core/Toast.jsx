import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children, duration = 3500 }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random();
    setToasts((items) => [...items, { id, message, type: options.type || "info" }]);
    window.setTimeout(() => remove(id), options.duration ?? duration);
    return id;
  }, [duration, remove]);

  const value = useMemo(() => ({ toast, remove }), [toast, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="rcui-toast-container">
        {toasts.map((item) => (
          <div key={item.id} className={`rcui-toast rcui-toast-${item.type}`} role="status">
            <span>{item.message}</span>
            <button onClick={() => remove(item.id)} aria-label="Dismiss">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider.");
  return context;
}