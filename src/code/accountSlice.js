import { createSlice, current } from "@reduxjs/toolkit";
import { Account, Ledger } from "./classes.js";

export const accountSlice = createSlice({
    name: "accounts",
    initialState: {
        selected: window.electron.readAccounts().length > 0 ? new Account(window.electron.readAccounts()[0]) : null,
        list: window.electron.readAccounts().map((val) => new Account(val))
    },
    reducers: {
        recordTrade(state, action) {
            current(state).selected.ledger.post(action.payload);
        },
        removeTrade(state, action) {
            current(state).selected.ledger.delete(action.payload);
        },
        setSelectedAccount(state, action) {
            const existingAccount = current(state).list.find((a) => a.name === action.payload);
            if (existingAccount != null) {
                state.selected = existingAccount;
            } else {
                const newAccount = new Account({name: action.payload, ledger: new Ledger([])});
                state.list.push(newAccount);
                state.selected = newAccount;
            }
        },
        saveAccountToFile(state) {
            window.electron.writeAccount(current(state).selected.name.toLowerCase(), current(state).selected);
        },
        deleteAccountFile(state, action) {
            window.electron.deleteAccount(action.payload);
            state.list = window.electron.readAccounts().map((val) => new Account(val));
            state.selected = window.electron.readAccounts().length > 0 ? new Account(window.electron.readAccounts()[0]) : null
        }
    }
});

export const { recordTrade, removeTrade, setSelectedAccount, saveAccountToFile, deleteAccountFile } = accountSlice.actions;

export default accountSlice.reducer;