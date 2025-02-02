export const getLocalStorage = () => {
  if (typeof window !== "undefined") {
    return sessionStorage;
  }
  return;
};

export const getItemLocalStorage = (key: string) => {
  const storage = getLocalStorage();
  return storage?.getItem(key);
};

export const setItemLocalStorage = (key: string, value: string) => {
  const storage = getLocalStorage();

  storage?.setItem(key, value);
};

export const removeItemLocalStorage = (key: string) => {
  const storage = getLocalStorage();

  storage?.removeItem(key);
};

export const clearLocalStorage = () => {
  const storage = getLocalStorage();
  storage?.clear();
};
