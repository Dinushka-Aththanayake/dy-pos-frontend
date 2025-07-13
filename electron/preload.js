const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    showMessageBox: async (options) => {
        return await ipcRenderer.invoke('show-message-box', options);
    },
    showPromptBox: async (options) => {
        return await ipcRenderer.invoke('show-prompt-box', options);
    }
});
