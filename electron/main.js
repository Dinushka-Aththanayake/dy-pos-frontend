// electron/main.js (ESM version)
import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import prompt from 'electron-prompt';

// ESM replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: false,
      preload: path.join(__dirname, 'preload.js'), // Add preload script
    },
  });

  // Prevent leaving fullscreen via keyboard shortcuts or menu
  mainWindow.on('leave-full-screen', () => {
    mainWindow.setFullScreen(true);
  });

  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  mainWindow.focus();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

Menu.setApplicationMenu(null);

// IPC handlers for messages
ipcMain.handle('show-message-box', async (event, options) => {
  return await dialog.showMessageBox(mainWindow, options);
});

// IPC handler for prompt dialog
ipcMain.handle('show-prompt-box', async (event, options) => {
  const result = await prompt({
    title: options.title || 'Input',
    label: options.message || 'Please enter a value:',
    value: options.defaultValue || null,
    inputAttrs: {
      type: 'text',
    },
    type: 'input',
  }, mainWindow);
  
  return result; // Returns the input value or null if cancelled
});
