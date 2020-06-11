// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')


function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 670,
    resizable: false,
    autoHideMenuBar: true,
    icon: 'Dragonfly_32px.ico',
    title: 'MR数据筛选工具',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Menu.setApplicationMenu(null);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.whenReady().then(createWindow)
app.whenReady().then(() => {
  createWindow();
});

app.allowRendererProcessReuse = false;
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// =========================
const { ipcMain } = require('electron');
const process = require('./process')
// 读取数据时处理
ipcMain.on('process', (event, arg) => {
  process.process(event,arg, path.join(__dirname,'result.csv'));
})