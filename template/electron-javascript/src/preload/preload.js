import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';

const electron = {
  ipcRenderer: {
    sendMessage(channel, ...args) {
      ipcRenderer.send(channel, args);
    },
    on(channel, func) {
      const subscription = (_event, ...args) => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel, func) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel, ...args) {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electron);

console.log('preload success!');
