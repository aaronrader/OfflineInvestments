import { contextBridge } from "electron";
import fs from "node:fs"

contextBridge.exposeInMainWorld(
    "electron",
    {
        readAccounts: () => fs.readdirSync(`./src/data/accounts/`).map((fileName) => JSON.parse(fs.readFileSync(`./src/data/accounts/${fileName}`, "utf8"))),
        readSecurities: () => JSON.parse(fs.readFileSync(`./src/data/securities.json`, "utf8")),
        writeAccount: (name, data) => fs.writeFileSync(`./src/data/accounts/${name}.json`, JSON.stringify(data)),
        writeSecurities: (data) => fs.writeFileSync(`./src/data/securities.json`, JSON.stringify(data)),
    }
)