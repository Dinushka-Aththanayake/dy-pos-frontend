const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  showMessageBox: async (options) => {
    return await ipcRenderer.invoke('show-message-box', options);
  },
  showErrorBox: (title, content) => {
    ipcRenderer.invoke('show-error-box', title, content);
  },
});
