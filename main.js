// main.js
import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
import { dirname } from "node:path";
import ChildProcess from "node:child_process";

const userDataPath = `${app.getPath("userData")}/data`;

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

    //win.loadURL('http://localhost:3000'); // URL of the React app
    win.loadFile(path.join(dirname(fileURLToPath(import.meta.url)), 'build', 'index.html'));
}

function setupData() {
    fs.mkdirSync(`${userDataPath}/accounts/`, { recursive: true });
    if (!fs.existsSync(`${userDataPath}/securities.json`))
        fs.writeFileSync(`${userDataPath}/securities.json`, JSON.stringify([]));
}

function readAllAccounts() {
    return fs.readdirSync(`${userDataPath}/accounts/`).map((fileName) => fileName.substring(0, fileName.lastIndexOf(".")));
}
function readAccount(name) {
    return fs.readFileSync(`${userDataPath}/accounts/${name}.json`, "utf8");
}
function saveAccount(data) {
    fs.writeFileSync(`${userDataPath}/accounts/${data.name}.json`, JSON.stringify(data));
    return data;
}
function deleteAccount(name) {
    fs.rmSync(`${userDataPath}/accounts/${name}.json`);
    return name;
}
function readSecurities() {
    return fs.readFileSync(`${userDataPath}/securities.json`, "utf8");
}
function saveSecurities(data) {
    fs.writeFileSync(`${userDataPath}/securities.json`, JSON.stringify(data));
    return data;
}

/* App Launch */
if (handleSquirrelEvent()) {
    setTimeout(app.quit, 1000);
}
app.setAppUserModelId("com.squirrel.AppName.AppName");
app.whenReady().then(() => {
    /* Listeners */
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
    ipcMain.on("read-all-accounts", (event) => {
        event.returnValue = readAllAccounts();
    })
    ipcMain.on("read-account", (event, name) => {
        event.returnValue = readAccount(name);
    });
    ipcMain.on("save-account", (event, data) => {
        event.returnValue = saveAccount(data);
    });
    ipcMain.on("read-securities", (event) => {
        event.returnValue = readSecurities();
    });
    ipcMain.on("save-securities", (event, data) => {
        event.returnValue = saveSecurities(data);
    });
    ipcMain.on("delete-account", (event, name) => {
        event.returnValue = deleteAccount(name);
    })
}).then(setupData).then(createWindow);