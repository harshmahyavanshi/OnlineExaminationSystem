const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow () {
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true,
  });
  mainWindow = new BrowserWindow({ webPreferences: { webSecurity: false, nodeIntegration: true, enableRemoteModule: true },icon : './Icon.png' });
  //mainWindow.setMenu(null);
  
  mainWindow.maximize();
  mainWindow.loadURL(startUrl);
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.setTitle('Examination Room');
}

const template = [
    {
       role: 'help',
       submenu: [
          {
             label: 'Learn More'
          }
       ]
    }
 ]

const menu = Menu.buildFromTemplate(template);
//Menu.setApplicationMenu(menu);

app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});