import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';

const electron = {
  ipcRenderer: {
    sendMessage(channel: string, ...args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: string, ...args: unknown[]): Promise<any> {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
};

export type ElectronType = typeof electron;

contextBridge.exposeInMainWorld('electron', electron);

console.log('preload success!');
