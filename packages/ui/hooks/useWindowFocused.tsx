import { useEffect, useState } from 'react';

let initFocused: boolean | null = null;
const promise = window.electron.ipcRenderer
  .invoke('is-window-focused')
  .then((data) => {
    initFocused = data.focused;
  });

export function useWindowFocused() {
  if (initFocused === null) {
    throw promise;
  }
  const [windowFocused, setWindowFocused] = useState(initFocused);
  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on(
      'on-window-focus-change',
      (_, data) => {
        setWindowFocused(data.focused);
      }
    );
    return () => unsubscribe();
  }, []);
  return windowFocused;
}
