/* eslint-disable @typescript-eslint/no-explicit-any */
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, listener: (event: any, ...args: any[]) => void) => {
    ipcRenderer.on(channel, listener);
  },
  invoke: (channel: string, data: any) => {
    return ipcRenderer.invoke(channel, data);
  },
  removeEventListener: (
    channel: string,
    listener: (event: any, ...args: any[]) => void
  ) => {
    ipcRenderer.removeListener(channel, listener);
  },
  // Expose any APIs you want to be available in the renderer process
  // (e.g. to enable the use of Node.js modules in the renderer)
  // api: require('./api'),
  // ipcRenderer: require('electron').ipcRenderer,
  // remote: require('electron').remote,
  // shell: require('electron').shell,
  // etc.
});
