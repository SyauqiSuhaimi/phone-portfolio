"use client";

import { useCallback } from "react";

export const useHaptics = () => {
  const triggerHaptic = useCallback((pattern: number[] = [10]) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  return { triggerHaptic };
};
