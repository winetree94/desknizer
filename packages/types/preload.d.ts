import {
  IpcRendererInvokeEventListeners,
  IpcRendererOnEventListeners,
} from './ipc';

export interface PreloadApis {
  electron: {
    ipcRenderer: {
      on: IpcRendererOnEventListeners;
      invoke: IpcRendererInvokeEventListeners;
    };
  };
}
