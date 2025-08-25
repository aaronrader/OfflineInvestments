// main.js
import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { dirname } from "node:path";

function createWindow() {

    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        minWidth: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(dirname(fileURLToPath(import.meta.url)), "preload.js")
        },
        autoHideMenuBar: true,
    });

    //win.loadURL('http://localhost:3000'); // URL of the React app
    win.loadFile(path.join(dirname(fileURLToPath(import.meta.url)), 'build', 'index.html'));
}

app.setAppUserModelId("com.squirrel.AppName.AppName");

app.whenReady().then(createWindow);

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});