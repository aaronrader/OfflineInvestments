import { createSlice } from "@reduxjs/toolkit";

import { Account } from "./classes";

export const accountSlice = createSlice({
    name: "account",
    initialState: {value: new Account(JSON.parse(window.electron.readFile("./src/data/account.json")))},
    reducers: {
        recordTrade(state, action) {
            state.value.ledger.post(action.payload);
        },
        removeTrade(state, action) {
            state.value.ledger.delete(action.payload);
        },
        saveAccountToFile(state) {
            window.electron.writeFile("./src/data/account.json", JSON.stringify(state.value));
        }
    }
});

export const { recordTrade, removeTrade, saveAccountToFile } = accountSlice.actions;

export default accountSlice.reducer;