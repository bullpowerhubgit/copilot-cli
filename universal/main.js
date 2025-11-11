const { app, BrowserWindow, globalShortcut, ipcMain, clipboard, screen } = require('electron');
const path = require('path');
const Store = require('electron-store');
const clipboardy = require('clipboardy');
const robot = require('robotjs');
const AIProvider = require('./ai-provider');

const store = new Store();
let overlayWindow = null;
let aiProvider = null;
let isVisible = false;

// App als Single Instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (overlayWindow) {
      toggleOverlay();
    }
  });
}

function createOverlayWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  overlayWindow = new BrowserWindow({
    width: 500,
    height: 600,
    x: width - 520,
    y: 20,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  overlayWindow.loadFile('overlay.html');
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  overlayWindow.setAlwaysOnTop(true, 'screen-saver');

  // Verhindere, dass Fenster Fokus stiehlt
  overlayWindow.on('blur', () => {
    if (isVisible) {
      overlayWindow.setAlwaysOnTop(true, 'screen-saver');
    }
  });

  if (process.argv.includes('--dev')) {
    overlayWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(() => {
  createOverlayWindow();
  registerGlobalShortcuts();
  setupTrayIcon();
});

function registerGlobalShortcuts() {
  // Win+Shift+A - Overlay ein/ausblenden
  globalShortcut.register('CommandOrControl+Shift+A', () => {
    toggleOverlay();
  });

  // Win+Shift+C - Text aus Zwischenablage analysieren
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    handleClipboardRequest();
  });

  // Win+Shift+V - Letzte Antwort einfügen
  globalShortcut.register('CommandOrControl+Shift+V', () => {
    pasteLastResponse();
  });

  // Win+Shift+S - Screenshot & Analyse
  globalShortcut.register('CommandOrControl+Shift+S', () => {
    captureAndAnalyze();
  });

  console.log('✅ Globale Hotkeys registriert:');
  console.log('   Ctrl+Shift+A - Overlay öffnen/schließen');
  console.log('   Ctrl+Shift+C - Zwischenablage analysieren');
  console.log('   Ctrl+Shift+V - Antwort einfügen');
  console.log('   Ctrl+Shift+S - Screenshot analysieren');
}

function toggleOverlay() {
  if (isVisible) {
    overlayWindow.hide();
    isVisible = false;
  } else {
    overlayWindow.show();
    overlayWindow.focus();
    isVisible = true;
  }
}

function setupTrayIcon() {
  const { Tray, Menu } = require('electron');

  // Erstelle System Tray Icon
  const tray = new Tray(path.join(__dirname, 'assets/tray-icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Copilot öffnen (Ctrl+Shift+A)',
      click: () => toggleOverlay()
    },
    { type: 'separator' },
    {
      label: 'Einstellungen',
      click: () => {
        overlayWindow.show();
        overlayWindow.webContents.send('open-settings');
      }
    },
    {
      label: 'Autostart',
      type: 'checkbox',
      checked: app.getLoginItemSettings().openAtLogin,
      click: (item) => {
        app.setLoginItemSettings({ openAtLogin: item.checked });
      }
    },
    { type: 'separator' },
    {
      label: 'Beenden',
      click: () => app.quit()
    }
  ]);

  tray.setToolTip('Copilot Universal Assistant');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    toggleOverlay();
  });
}

async function handleClipboardRequest() {
  try {
    const clipboardText = clipboardy.readSync();

    if (!clipboardText) {
      showNotification('Zwischenablage ist leer');
      return;
    }

    toggleOverlay();
    overlayWindow.webContents.send('clipboard-request', clipboardText);
  } catch (error) {
    console.error('Clipboard-Fehler:', error);
  }
}

function pasteLastResponse() {
  const lastResponse = store.get('lastResponse', '');

  if (lastResponse) {
    clipboardy.writeSync(lastResponse);

    // Simuliere Ctrl+V nach kurzer Verzögerung
    setTimeout(() => {
      robot.keyTap('v', ['control']);
    }, 100);

    showNotification('Antwort eingefügt!');
  } else {
    showNotification('Keine Antwort verfügbar');
  }
}

async function captureAndAnalyze() {
  try {
    const screenshot = require('screenshot-desktop');
    const imgPath = path.join(app.getPath('temp'), 'screenshot.png');

    await screenshot({ filename: imgPath });

    showNotification('Screenshot erstellt! Analyse folgt...');
    toggleOverlay();
    overlayWindow.webContents.send('screenshot-captured', imgPath);
  } catch (error) {
    console.error('Screenshot-Fehler:', error);
    showNotification('Screenshot fehlgeschlagen');
  }
}

function showNotification(message) {
  const { Notification } = require('electron');

  if (Notification.isSupported()) {
    new Notification({
      title: 'Copilot Universal',
      body: message,
      silent: false
    }).show();
  }
}

// IPC Handlers
ipcMain.handle('get-config', () => {
  return {
    defaultModel: store.get('defaultModel', 'groq-llama-70b'),
    groqApiKey: store.get('groqApiKey', ''),
    openrouterApiKey: store.get('openrouterApiKey', ''),
    huggingfaceApiKey: store.get('huggingfaceApiKey', ''),
    googleApiKey: store.get('googleApiKey', ''),
    ollamaHost: store.get('ollamaHost', 'http://localhost:11434'),
    autostart: app.getLoginItemSettings().openAtLogin
  };
});

ipcMain.handle('save-config', (event, config) => {
  Object.keys(config).forEach(key => {
    if (key === 'autostart') {
      app.setLoginItemSettings({ openAtLogin: config[key] });
    } else {
      store.set(key, config[key]);
    }
  });
  return true;
});

ipcMain.handle('hide-overlay', () => {
  overlayWindow.hide();
  isVisible = false;
});

ipcMain.handle('get-clipboard', () => {
  return clipboardy.readSync();
});

ipcMain.handle('set-clipboard', (event, text) => {
  clipboardy.writeSync(text);
  return true;
});

ipcMain.handle('type-text', (event, text) => {
  // Schreibe in Zwischenablage und simuliere Paste
  clipboardy.writeSync(text);

  setTimeout(() => {
    robot.keyTap('v', ['control']);
  }, 200);

  return true;
});

ipcMain.handle('send-message', async (event, { messages, model }) => {
  try {
    aiProvider = new AIProvider(model, {
      groqApiKey: store.get('groqApiKey', ''),
      openrouterApiKey: store.get('openrouterApiKey', ''),
      huggingfaceApiKey: store.get('huggingfaceApiKey', ''),
      googleApiKey: store.get('googleApiKey', ''),
      ollamaHost: store.get('ollamaHost', 'http://localhost:11434')
    });

    const response = await aiProvider.sendMessage(messages);

    // Speichere letzte Antwort
    store.set('lastResponse', response);

    return { success: true, response };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-models', () => {
  const provider = new AIProvider();
  return provider.getAvailableModels();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', (e) => {
  e.preventDefault();
});
