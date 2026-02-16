import { useState, useEffect } from 'react';

interface UseDelayedRenderOptions {
  enterDelay?: number;
  exitDelay?: number;
}

export default function useDelayedRender(
  active: boolean,
  options: UseDelayedRenderOptions = {}
): { mounted: boolean; rendered: boolean } {
  const { enterDelay = 0, exitDelay = 0 } = options;
  const [mounted, setMounted] = useState(active);
  const [rendered, setRendered] = useState(active);

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        setMounted(true);
        setRendered(true);
      }, enterDelay);
      return () => clearTimeout(timer);
    } else {
      setRendered(false);
      const unmountTimer = setTimeout(() => setMounted(false), exitDelay);
      return () => clearTimeout(unmountTimer);
    }
  }, [active, enterDelay, exitDelay]);

  return { mounted, rendered };
}
