"use client";

import { useUserTiming } from "@/lib/hooks/useUserTiming";

interface PerformanceTrackerProps {
  name: string;
}

export const PerformanceTracker = ({ name }: PerformanceTrackerProps) => {
  useUserTiming(name);
  return null; // This component renders nothing visually
};
