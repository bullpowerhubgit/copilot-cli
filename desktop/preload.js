const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  getModels: () => ipcRenderer.invoke('get-models'),
  sendMessage: (data) => ipcRenderer.invoke('send-message', data)
});
