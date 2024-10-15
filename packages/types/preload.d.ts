import {
  IpcRendererInvokeEventListeners,
  IpcRendererOnEventListeners,
} from './ipc';
import { IpcRenderer } from 'electron';

export interface PreloadApis {
  electron: {
    ipcRenderer: {
      on: IpcRendererOnEventListeners;
      invoke: IpcRendererInvokeEventListeners;
      removeListener: IpcRenderer['removeListener'];
    };
  };
}
