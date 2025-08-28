import { createSlice, current } from "@reduxjs/toolkit";
import { Account, Ledger } from "./classes.js";

export const accountSlice = createSlice({
    name: "accounts",
    initialState: {
        selected: null,
        list: window.electron.loadAccountList()
    },
    reducers: {
        recordTrade(state, action) {
            current(state).selected.ledger.post(action.payload);
        },
        removeTrade(state, action) {
            current(state).selected.ledger.delete(action.payload);
        },

        updateAccountList(state) {
            state.list = window.electron.loadAccountList();
        },
        setSelectedAccount(state, action) {
            state.selected = new Account(JSON.parse(window.electron.loadAccount(action.payload)));
        },
        createNewAccount(state, action) {
            window.electron.saveAccount(new Account({name: action.payload, ledger: new Ledger([])}));
            state.selected = new Account(JSON.parse(window.electron.loadAccount(action.payload)));
        },
        saveAccountToFile(state) {
            window.electron.saveAccount(current(state).selected);
        },
        deleteAccountFile(state, action) {
            window.electron.deleteAccount(action.payload);
            state.list = window.electron.loadAccountList();
            state.selected = null;
        }
    }
});

export const { recordTrade, removeTrade, updateAccountList, setSelectedAccount, createNewAccount, saveAccountToFile, deleteAccountFile } = accountSlice.actions;

export default accountSlice.reducer;