import { BrowserWindow, app } from 'electron';
import path from 'path';

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

const resourcesPath = isDevelopment ? path.join(__dirname, '../../') : process.resourcesPath;

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'main',
    show: true,
    center: true,
    width: 1000,
    height: 600,
    icon: path.join(resourcesPath, 'assets/icon.png'),
    webPreferences: {
      sandbox: false,
      preload: path.join(
        isDevelopment ? resourcesPath : path.join(resourcesPath, 'app'),
        'out/preload/preload.js',
      ),
    },
  });
  const indexPath = 'index.html';
  if (isDevelopment) {
    const url = new URL(process.env['ELECTRON_RENDERER_URL']!);
    url.pathname = indexPath;
    mainWindow.loadURL(url.href).then(() => {
      if (mainWindow && !mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.openDevTools();
      }
    });
  } else {
    mainWindow.loadURL(
      `file://${path.resolve(process.resourcesPath, 'app/out/renderer/', indexPath)}`,
    );
  }
  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function main() {
  app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  await app.whenReady();

  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow == null) {
      createWindow();
    }
  });
}

main();
