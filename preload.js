import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld(
    "electron",
    {
        loadAccountList: () => ipcRenderer.sendSync("read-all-accounts"),
        loadAccount: (name) => ipcRenderer.sendSync("read-account", name),
        saveAccount: (data) => ipcRenderer.sendSync("save-account", data),
        deleteAccount: (name) => ipcRenderer.sendSync("delete-account", name),
        
        loadSecurities: () => ipcRenderer.sendSync("read-securities"),
        saveSecurities: (data) => ipcRenderer.sendSync("save-securities", data)
    }
)