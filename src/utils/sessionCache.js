const DEFAULT_TTL_MS = 5 * 60 * 1000;

export function getSessionCache(key, ttlMs = DEFAULT_TTL_MS) {
  try {
    const cached = window.sessionStorage.getItem(key);

    if (!cached) {
      return null;
    }

    const { value, savedAt } = JSON.parse(cached);

    if (!savedAt || Date.now() - savedAt > ttlMs) {
      window.sessionStorage.removeItem(key);
      return null;
    }

    return value;
  } catch (error) {
    window.sessionStorage.removeItem(key);
    return null;
  }
}

export function setSessionCache(key, value) {
  window.sessionStorage.setItem(
    key,
    JSON.stringify({
      value,
      savedAt: Date.now(),
    })
  );
}
