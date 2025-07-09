// electron/main.js (ESM version)
import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: false,
    },
  });

  // Prevent leaving fullscreen via keyboard shortcuts or menu
  win.on('leave-full-screen', () => {
    win.setFullScreen(true);
  });

  win.loadFile(path.join(__dirname, '../dist/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

Menu.setApplicationMenu(null);
