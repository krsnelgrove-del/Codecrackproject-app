// app/(utils)/systemMetricsPoller.tsx
"use client";

import { useDashboardStore } from "./useMetricsStore";
import { useEffect, useState } from "react";

export function SystemMetricsPoller() {
  const [mounted, setMounted] = useState(false);
  const batchUpdate = useDashboardStore((state) => state.batchUpdate);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const controller = new AbortController();

    const networkPoll = async () => {
      try {
        const response = await fetch("/api/networkMetric", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error 500 thrown:  ${response.status}: ${errorText}`);
}

        const data = await response.json();

        batchUpdate({
          latency: data.latency,
          serverLatency: data.latency,
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Metrics polling failed:", err);
        }
      }
    };

        const visitorPoll = async () => {
      try {
        const response = await fetch("/api/visitorCount", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error 500 thrown:  ${response.status}: ${errorText}`);
}

        const data = await response.json();

        batchUpdate({
          visitCount: data.visitCount,
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Metrics polling failed:", err);
        }
      }
    };

    networkPoll(); // Run immediately on mount
    visitorPoll(); // Run immediately on mount

    const interval = setInterval(networkPoll, 1000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [mounted, batchUpdate]);

  return null;
}