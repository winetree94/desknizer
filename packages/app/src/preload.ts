// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { PreloadApis } from '@note/types/preload';
import { IpcRendererOnEventListeners } from '@note/types/ipc';

// @es-lint-ignore
const on: IpcRendererOnEventListeners = (event: any, listener: any) => {
  ipcRenderer.on(event, listener);
};

const removeListener = (event: string, listener: (...args: any[]) => void) => {
  return ipcRenderer.removeListener(event, listener);
};

const apis: PreloadApis['electron'] = {
  ipcRenderer: {
    on: on,
    invoke: ipcRenderer.invoke,
    removeListener: removeListener,
  },
};

contextBridge.exposeInMainWorld('electron', apis);
