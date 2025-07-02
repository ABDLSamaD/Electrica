"use client";

import { createContext, useContext, useState, useCallback } from "react";
import EnhancedAlert from "./EnhancedAlert";

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback((alertProps) => {
    const id = Date.now() + Math.random();
    const alert = { id, ...alertProps };

    setAlerts((prev) => [...prev, alert]);

    return id;
  }, []);

  const hideAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const hideAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Convenience methods
  const success = useCallback(
    (message, options = {}) => {
      return showAlert({ type: "success", message, ...options });
    },
    [showAlert]
  );

  const error = useCallback(
    (message, options = {}) => {
      return showAlert({ type: "error", message, ...options });
    },
    [showAlert]
  );

  const info = useCallback(
    (message, options = {}) => {
      return showAlert({ type: "info", message, ...options });
    },
    [showAlert]
  );

  const warning = useCallback(
    (message, options = {}) => {
      return showAlert({ type: "warning", message, ...options });
    },
    [showAlert]
  );

  const value = {
    showAlert,
    hideAlert,
    hideAllAlerts,
    success,
    error,
    info,
    warning,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-50">
        {alerts.map((alert) => (
          <EnhancedAlert
            key={alert.id}
            {...alert}
            onClose={() => hideAlert(alert.id)}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
};
