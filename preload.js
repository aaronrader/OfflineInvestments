const { contextBridge } = require("electron");
const fs = require("node:fs")

contextBridge.exposeInMainWorld(
    "electron",
    {
        readFile: (path) => fs.readFileSync(path, "utf8"),
        writeFile: (path, data) => fs.writeFileSync(path, data)
    }
)