import { contextBridge } from "electron";
import fs from "node:fs"

contextBridge.exposeInMainWorld(
    "electron",
    {
        readAccounts: () => {
            if (!fs.existsSync(`./data/`)) {
                fs.mkdirSync(`./data/`);
                if (!fs.existsSync(`./data/accounts/`)) {
                    fs.mkdirSync(`./data/accounts/`);
                }
            }
            return fs.readdirSync(`./data/accounts/`).map((fileName) => JSON.parse(fs.readFileSync(`./data/accounts/${fileName}`, "utf8")))
        },
        readSecurities: () => {
            if (!fs.existsSync(`./data/securities.json`)) {
                fs.writeFileSync(`./data/securities.json`, JSON.stringify([]));
            }
            return JSON.parse(fs.readFileSync(`./data/securities.json`, "utf8"))
        },
        writeAccount: (name, data) => fs.writeFileSync(`./data/accounts/${name}.json`, JSON.stringify(data)),
        writeSecurities: (data) => fs.writeFileSync(`./data/securities.json`, JSON.stringify(data)),
    }
)