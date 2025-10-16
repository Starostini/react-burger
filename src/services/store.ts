import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";


export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefault) => getDefault(),
});

export type AppDispatch = typeof store.dispatch;