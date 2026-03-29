export const getItem = (key: string): string | null => {
  return sessionStorage.getItem(key) ?? localStorage.getItem(key);
};

export const setItem = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

export const removeItem = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch {
    void 0;
  }
  try {
    localStorage.removeItem(key);
  } catch {
    void 0;
  }
};
export const getJSONItem = <T = unknown>(key: string): T | null => {
  const raw = getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};
