// src/prisma/connectionCheck.ts
"use server"

import { db } from "./db"; 

export async function measureNetworkLatency(): Promise<number> {
  const start = performance.now();
  try {
    await fetch("https://1.1.1.1", {
      method: "HEAD",
      cache: "no-store",
    });

    const end = performance.now();
    return Math.round(end - start);
  } catch (error) {
    console.error("Latency check failed:", error);
    return 15; // fallback 
  }
}
