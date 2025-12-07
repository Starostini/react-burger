import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { createSocketMiddleware } from "./socketMiddleware";
import { ordersFeedActions } from "./ordersFeedSlice";
import { userOrdersActions } from "./userOrdersSlice";
import { ORDERS_FEED_WS_URL, USER_ORDERS_WS_URL } from "../base";
import { getAccessToken } from "../utils/token";

const ordersFeedMiddleware = createSocketMiddleware({
    wsUrl: ORDERS_FEED_WS_URL,
    actions: ordersFeedActions,
});

const userOrdersMiddleware = createSocketMiddleware({
    wsUrl: USER_ORDERS_WS_URL,
    actions: userOrdersActions,
    withToken: true,
    getToken: getAccessToken,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefault) => getDefault().concat(ordersFeedMiddleware, userOrdersMiddleware),
});

export type AppDispatch = typeof store.dispatch;
