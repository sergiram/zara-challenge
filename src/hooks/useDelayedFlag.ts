import { useEffect, useState } from 'react';

export function useDelayedFlag(active: boolean, delay = 300): boolean {
  const [hasDelayPassed, setHasDelayPassed] = useState(false);

  useEffect(() => {
    if (!active) return;

    const timeoutId = setTimeout(() => setHasDelayPassed(true), delay);

    return () => {
      clearTimeout(timeoutId);
      setHasDelayPassed(false);
    };
  }, [active, delay]);

  return active && hasDelayPassed;
}
