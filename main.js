// main.js
import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { dirname } from "node:path";
import ChildProcess from "node:child_process";

function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawnUpdate = function (args) {
        return ChildProcess.spawn(updateDotExe, args, { detached: true });
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Install desktop shortcut
            spawnUpdate(['--createShortcut', exeName]);
            return true;

        case '--squirrel-uninstall':
            // Remove desktop shortcut
            spawnUpdate(['--removeShortcut', exeName]);
            return true;

        case '--squirrel-obsolete':
            app.quit();
            return true;
    }
};

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

    win.loadURL('http://localhost:3000'); // URL of the React app
    //win.loadFile(path.join(dirname(fileURLToPath(import.meta.url)), 'build', 'index.html'));
}

if (handleSquirrelEvent()) {
    setTimeout(app.quit, 1000);
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