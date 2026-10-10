import { create } from "zustand";

interface UseMetricsStore {
  latency: number | null;
  visitCount: number | null;
  decryptionEfficiency: number | null;
  memoryUsage: number | null;
  serverLoad: number | null;
  serverLatency: number | null;
  activeSessions: number | null;
  
  // Actions to update metrics
  setMetric: <K extends keyof Omit<UseMetricsStore, "setMetric" | "batchUpdate">>(
    key: K,
    value: UseMetricsStore[K]
  ) => void;
  batchUpdate: (updates: Partial<Omit<UseMetricsStore, "setMetric" | "batchUpdate">>) => void;
}

export const useDashboardStore = create<UseMetricsStore>((set) => ({
  latency: null,
  visitCount: null,
  decryptionEfficiency: null,
  memoryUsage: null,
  serverLoad: null,
  serverLatency: null,
  activeSessions: 0,

  setMetric: (key, value) => set((state) => ({ ...state, [key]: value })),
  batchUpdate: (updates) => set((state) => ({ ...state, ...updates })),
}));