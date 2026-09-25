// config/dashboardCards.ts
import React from "react";
import {
  BreachAttemptsCard,
  ActiveSessionsCard,
  DataTrackerCard,
  DecryptionEfficiencyCard,
  MemoryLatencyCard,
  ServerLoadCard,
} from "@/components/cards";

export enum CardTypes {
    BREACH_ATTEMPTS =  "breach-attempts",
    ACTIVE_SESSIONS = "active-sessions",
    DATA_TRACKER = "data-tracker",
    DECRYPTION_EFFICIENCY = "decryption-efficiency",
    MEMORY_LATENCY = "memory-latency",
    SERVER_LOAD = "server-load"
}

export interface CardConfig {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  gridSpan?: string;
  initialData?: Record<string, any>;
}

export const DashboardCards: CardConfig[] = [
  {
    id: "breach-attempts",
    title: "Breach Attempts",
    component: BreachAttemptsCard,
    initialData: { totalAttempts: 142, status: "Heh. Not so good." },
  },
  {
    id: "active-sessions",
    title: "Active Sessions",
    component: ActiveSessionsCard,
    initialData: { activeUsers: 294 },
  },
  {
    id: "data-tracker",
    title: "Data Tracker",
    component: DataTrackerCard,
    initialData: { decryptedMb: 812 },
  },
  {
    id: "decryption-efficiency",
    title: "Decryption Efficiency",
    component: DecryptionEfficiencyCard,
    initialData: { rate: "94.5392%" },
  },
  {
    id: "memory-latency",
    title: "Memory Latency",
    component: MemoryLatencyCard,
    initialData: { pingMs: 18 },
  },
  {
    id: "server-load",
    title: "Server Load",
    component: ServerLoadCard,
    initialData: { cpuUsage: 68 },
  },
];

