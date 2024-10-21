// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { PreloadApis } from '@note/types/preload';
import { IpcRendererOnEventListeners } from '@note/types/ipc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const on: IpcRendererOnEventListeners = (event: any, listener: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriber = (...args: any[]) => listener(...args);
  ipcRenderer.on(event, subscriber);
  return () => ipcRenderer.removeListener(event, subscriber);
};

const apis: PreloadApis['electron'] = {
  ipcRenderer: {
    on: on,
    invoke: ipcRenderer.invoke,
    send: ipcRenderer.send,
  },
};

contextBridge.exposeInMainWorld('electron', apis);
