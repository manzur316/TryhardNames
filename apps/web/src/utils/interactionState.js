import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const INTERACTION_TIMING = Object.freeze({
  feedbackMs: 1200,
  preventRepeatCopyMs: 450,
  preventRepeatShareMs: 650,
});

export function useIsMountedRef() {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return mounted;
}

export function useTimeoutRegistry() {
  const timeoutsRef = useRef(new Set());
  useEffect(() => {
    return () => {
      for (const id of timeoutsRef.current) clearTimeout(id);
      timeoutsRef.current.clear();
    };
  }, []);

  const setSafeTimeout = useCallback((fn, ms) => {
    const id = setTimeout(() => {
      timeoutsRef.current.delete(id);
      fn();
    }, ms);
    timeoutsRef.current.add(id);
    return id;
  }, []);

  const clearSafeTimeout = useCallback((id) => {
    if (!id) return;
    clearTimeout(id);
    timeoutsRef.current.delete(id);
  }, []);

  return useMemo(() => ({ setSafeTimeout, clearSafeTimeout }), [setSafeTimeout, clearSafeTimeout]);
}

export function useTransientFlag({ durationMs = INTERACTION_TIMING.feedbackMs, initial = false } = {}) {
  const [value, setValue] = useState(Boolean(initial));
  const { setSafeTimeout, clearSafeTimeout } = useTimeoutRegistry();
  const timeoutRef = useRef(null);

  const setOn = useCallback(() => {
    setValue(true);
    if (timeoutRef.current) clearSafeTimeout(timeoutRef.current);
    timeoutRef.current = setSafeTimeout(() => setValue(false), durationMs);
  }, [clearSafeTimeout, durationMs, setSafeTimeout]);

  const setOff = useCallback(() => {
    if (timeoutRef.current) clearSafeTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setValue(false);
  }, [clearSafeTimeout]);

  return useMemo(() => ({ value, setOn, setOff, setValue }), [setOff, setOn, value]);
}

export function useTransientKey({ durationMs = INTERACTION_TIMING.feedbackMs } = {}) {
  const [key, setKey] = useState(null);
  const { setSafeTimeout, clearSafeTimeout } = useTimeoutRegistry();
  const timeoutRef = useRef(null);

  const trigger = useCallback(
    (nextKey) => {
      setKey(nextKey);
      if (timeoutRef.current) clearSafeTimeout(timeoutRef.current);
      timeoutRef.current = setSafeTimeout(() => {
        setKey((current) => (current === nextKey ? null : current));
      }, durationMs);
    },
    [clearSafeTimeout, durationMs, setSafeTimeout]
  );

  const clear = useCallback(() => {
    if (timeoutRef.current) clearSafeTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setKey(null);
  }, [clearSafeTimeout]);

  return useMemo(() => ({ key, trigger, clear, setKey }), [clear, key, trigger]);
}

export function useAsyncLock() {
  const [locked, setLocked] = useState(false);
  const mounted = useIsMountedRef();

  const run = useCallback(
    async (fn) => {
      if (locked) return { ok: false, reason: 'locked' };
      setLocked(true);
      try {
        const res = await fn();
        return { ok: true, res };
      } catch (e) {
        return { ok: false, error: e };
      } finally {
        if (mounted.current) setLocked(false);
      }
    },
    [locked, mounted]
  );

  return useMemo(() => ({ locked, run, setLocked }), [locked, run]);
}

