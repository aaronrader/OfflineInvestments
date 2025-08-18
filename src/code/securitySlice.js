import { createSlice } from "@reduxjs/toolkit";

import data from "../data/securities.json";
import { Security } from "./classes";

export const securitySlice = createSlice({
    name: "securityList",
    initialState: {value: data},
    reducers: {
        addSecurity(state, action) {
            state.value.push(action.payload);
        },
        updateMarketValue(state, action) {
            state.value = state.value.map((security) => {
                if (security.ticket === action.payload.ticket)
                    return action.payload;
                else
                    return security;
            })
        }
    }
});

export const { addSecurity, updateMarketValue } = securitySlice.actions;

export default securitySlice.reducer;