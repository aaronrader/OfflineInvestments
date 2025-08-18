import { createSlice } from "@reduxjs/toolkit";

import { Account } from "./classes";

import data from "../data/account.json";

export const accountSlice = createSlice({
    name: "account",
    initialState: {value: new Account(data)},
    reducers: {
        recordTrade(state, action) {
            state.value.ledger.post(action.payload);
        }
    }
});

export const { recordTrade } = accountSlice.actions;

export default accountSlice.reducer;