import { createSlice, current } from "@reduxjs/toolkit";

export const securitySlice = createSlice({
    name: "securities",
    initialState: {
        list: window.electron.readSecurities()
    },
    reducers: {
        addSecurity(state, action) {
            if (state.list.find((val) => val.ticket === action.payload.ticket) === undefined) {
                state.list.push(action.payload);
            }
        },
        removeSecurity(state, action) {
            state.list = state.list.filter((val) => val.ticket !== action.payload.ticket)
        },
        updateMarketValue(state, action) {
            state.list = current(state).list.map((security) => {
                if (security.ticket === action.payload.ticket)
                    return action.payload;
                else
                    return security;
            })
        },
        saveSecurityListToFile(state) {
            window.electron.writeSecurities(current(state).list);
        }
    }
});

export const { addSecurity, removeSecurity, updateMarketValue, saveSecurityListToFile } = securitySlice.actions;

export default securitySlice.reducer;