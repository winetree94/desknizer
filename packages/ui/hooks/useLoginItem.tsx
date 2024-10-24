import { useState } from 'react';

let initIsLoginItem: boolean | null = null;
const promise = window.electron.ipcRenderer
  .invoke('get-is-login-item')
  .then((data) => {
    initIsLoginItem = data.isLoginItem;
  });

export function useLoginItem() {
  if (initIsLoginItem === null) {
    throw promise;
  }
  const [isLoginItem, setIsLoginItem] = useState(initIsLoginItem);

  return {
    isLoginItem,
    setIsLoginItem: (isLoginItem: boolean) => {
      window.electron.ipcRenderer.send('set-is-login-item', {
        isLoginItem,
      });
      setIsLoginItem(isLoginItem);
    },
  };
}
