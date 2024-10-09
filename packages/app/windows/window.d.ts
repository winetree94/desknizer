interface Window {
  electron: {
    ipcRenderer: import('electron').IpcRenderer;
    send: (channel: string, data: any) => void;
  };
}
