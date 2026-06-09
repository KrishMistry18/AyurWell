import { useState, useCallback } from "react";

/** Simple loading bar state — use with the .loading-bar CSS class */
export function useLoadingBar() {
  const [active, setActive] = useState(false);

  const start = useCallback(() => setActive(true), []);
  const stop = useCallback(() => {
    setActive(false);
  }, []);

  return { active, start, stop };
}
