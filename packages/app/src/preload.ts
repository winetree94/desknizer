// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { PreloadApis } from '@note/types/preload';

const apis: PreloadApis['electron'] = {
  ipcRenderer: {
    on: ipcRenderer.on,
    invoke: ipcRenderer.invoke,
    removeListener: ipcRenderer.removeListener,
  },
};

contextBridge.exposeInMainWorld('electron', apis);
