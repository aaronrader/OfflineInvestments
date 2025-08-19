import { createSlice } from "@reduxjs/toolkit";

export const securitySlice = createSlice({
    name: "securityList",
    initialState: {value: JSON.parse(window.electron.readFile("./src/data/securities.json"))},
    reducers: {
        addSecurity(state, action) {
            if (state.value.find((val) => val.ticket === action.payload.ticket) === undefined) {
                state.value.push(action.payload);
            }
        },
        removeSecurity(state, action) {
            state.value = state.value.filter((val) => val.ticket !== action.payload.ticket)
        },
        updateMarketValue(state, action) {
            state.value = state.value.map((security) => {
                if (security.ticket === action.payload.ticket)
                    return action.payload;
                else
                    return security;
            })
        },
        saveSecurityListToFile(state) {
            window.electron.writeFile("./src/data/securities.json", JSON.stringify(state.value));
        }
    }
});

export const { addSecurity, removeSecurity, updateMarketValue, saveSecurityListToFile } = securitySlice.actions;

export default securitySlice.reducer;