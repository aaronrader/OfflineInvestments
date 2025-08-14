// main.js
const {app, BrowserWindow} = require("electron");
const path = require("node:path");

function createWindow() {

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    win.loadURL('http://localhost:3000'); // URL of the React app
    //win.loadFile('./public/index.html')
    win.maximize();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});