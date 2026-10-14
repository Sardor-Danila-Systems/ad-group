import { useCallback, useSyncExternalStore } from "react";

const EVT = "local-store";

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** localStorage-backed value that is SSR-safe: the server snapshot is `serverValue`. */
export function useLocalValue(key: string, serverValue: string | null) {
  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener(EVT, cb);
    window.addEventListener("storage", cb);
    return () => {
      window.removeEventListener(EVT, cb);
      window.removeEventListener("storage", cb);
    };
  }, []);
  const value = useSyncExternalStore(subscribe, () => read(key), () => serverValue);
  const set = useCallback(
    (v: string) => {
      try {
        localStorage.setItem(key, v);
      } catch {}
      window.dispatchEvent(new Event(EVT));
    },
    [key],
  );
  return [value, set] as const;
}
