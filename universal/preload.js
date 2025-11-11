const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  getModels: () => ipcRenderer.invoke('get-models'),
  sendMessage: (data) => ipcRenderer.invoke('send-message', data),
  hideOverlay: () => ipcRenderer.invoke('hide-overlay'),
  getClipboard: () => ipcRenderer.invoke('get-clipboard'),
  setClipboard: (text) => ipcRenderer.invoke('set-clipboard', text),
  typeText: (text) => ipcRenderer.invoke('type-text', text),
  
  // Event Listeners
  onClipboardRequest: (callback) => {
    ipcRenderer.on('clipboard-request', (event, text) => callback(text));
  },
  onScreenshotCaptured: (callback) => {
    ipcRenderer.on('screenshot-captured', (event, path) => callback(path));
  },
  onOpenSettings: (callback) => {
    ipcRenderer.on('open-settings', () => callback());
  }
});
