import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrdersFeedItem, OrdersFeedResponse } from "../compoments/Interfaces/Interfaces";
import type { WsConnectionStatus } from "./ordersFeedSlice";

interface UserOrdersState {
    orders: OrdersFeedItem[];
    status: WsConnectionStatus;
    error: string | null;
}

const initialState: UserOrdersState = {
    orders: [],
    status: "idle",
    error: null,
};

const userOrdersSlice = createSlice({
    name: "userOrders",
    initialState,
    reducers: {
        connect(state) {
            state.status = "connecting";
            state.error = null;
        },
        disconnect() {
            return { ...initialState, status: "offline" } satisfies UserOrdersState;
        },
        connectionSuccess(state) {
            state.status = "online";
            state.error = null;
        },
        connectionClosed() {
            return { ...initialState, status: "offline" } satisfies UserOrdersState;
        },
        connectionError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.status = "offline";
        },
        receiveOrders(state, action: PayloadAction<OrdersFeedResponse>) {
            state.orders = action.payload.orders;
        },
        clearOrders() {
            return { ...initialState } satisfies UserOrdersState;
        },
    },
});

export const userOrdersReducer = userOrdersSlice.reducer;
export const userOrdersActions = userOrdersSlice.actions;
export type UserOrdersSliceState = UserOrdersState;
