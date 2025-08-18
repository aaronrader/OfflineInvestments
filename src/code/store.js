import { configureStore } from '@reduxjs/toolkit';

import accountReducer from './accountSlice';
import securityReducer from './securitySlice';

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