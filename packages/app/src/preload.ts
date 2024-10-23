// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { PreloadApis } from '@desknizer/types/preload';
import { IpcRendererOnEventListeners } from '@desknizer/types/ipc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const on: IpcRendererOnEventListeners = (event: any, listener: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriber = (...args: any[]) => listener(...args);
  ipcRenderer.on(event, subscriber);
  return () => ipcRenderer.removeListener(event, subscriber);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const once: IpcRendererOnEventListeners = (event: any, listener: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriber = (...args: any[]) => listener(...args);
  ipcRenderer.once(event, subscriber);
  return () => ipcRenderer.removeListener(event, subscriber);
};

const apis: PreloadApis['electron'] = {
  ipcRenderer: {
    on: on,
    once: once,
    invoke: ipcRenderer.invoke,
    send: ipcRenderer.send,
  },
};

contextBridge.exposeInMainWorld('electron', apis);
