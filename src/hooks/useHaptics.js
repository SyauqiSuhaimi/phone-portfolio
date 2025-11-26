import { useCallback } from 'react';

export const useHaptics = () => {
  const triggerHaptic = useCallback((pattern = [10]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  return { triggerHaptic };
};
