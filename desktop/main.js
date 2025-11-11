const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');
const AIProvider = require('./ai-provider');

const store = new Store();
let mainWindow;
let aiProvider;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true,
    backgroundColor: '#1e1e1e',
    show: false
  });

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // DevTools in Entwicklungsmodus
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handler für AI-Provider
ipcMain.handle('get-config', () => {
  return {
    defaultModel: store.get('defaultModel', 'groq-llama-70b'),
    groqApiKey: store.get('groqApiKey', ''),
    openrouterApiKey: store.get('openrouterApiKey', ''),
    huggingfaceApiKey: store.get('huggingfaceApiKey', ''),
    googleApiKey: store.get('googleApiKey', ''),
    ollamaHost: store.get('ollamaHost', 'http://localhost:11434')
  };
});

ipcMain.handle('save-config', (event, config) => {
  Object.keys(config).forEach(key => {
    store.set(key, config[key]);
  });
  return true;
});

ipcMain.handle('get-models', () => {
  const provider = new AIProvider();
  return provider.getAvailableModels();
});

ipcMain.handle('send-message', async (event, { messages, model }) => {
  try {
    const config = await ipcMain.emit('get-config');
    aiProvider = new AIProvider(model, {
      groqApiKey: store.get('groqApiKey', ''),
      openrouterApiKey: store.get('openrouterApiKey', ''),
      huggingfaceApiKey: store.get('huggingfaceApiKey', ''),
      googleApiKey: store.get('googleApiKey', ''),
      ollamaHost: store.get('ollamaHost', 'http://localhost:11434')
    });
    
    const response = await aiProvider.sendMessage(messages);
    return { success: true, response };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
