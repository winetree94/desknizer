import {
  IpcRendererInvokeEventListeners,
  IpcRendererOnEventListeners,
  IpcSendEventListeners,
} from './ipc';

export interface PreloadApis {
  electron: {
    ipcRenderer: {
      on: IpcRendererOnEventListeners;
      invoke: IpcRendererInvokeEventListeners;
      send: IpcSendEventListeners;
    };
  };
}
