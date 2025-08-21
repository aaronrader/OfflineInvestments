import { configureStore } from '@reduxjs/toolkit';

import accountReducer from './accountSlice.js';
import securityReducer from './securitySlice.js';

export default configureStore({
    reducer: {
        account: accountReducer,
        securityList: securityReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ["account"]
            }
        })
});