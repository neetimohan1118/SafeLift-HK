"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { alerts as initialAlerts, Alert } from "@/lib/mock-data";

interface AlertContextValue {
  alerts: Alert[];
  unreadCount: number;
  markAllRead: () => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const markAllRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, unreadCount, markAllRead }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlerts must be used within AlertProvider");
  return ctx;
}
