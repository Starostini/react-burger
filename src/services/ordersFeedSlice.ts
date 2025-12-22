import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrdersFeedItem, OrdersFeedResponse } from "../compoments/Interfaces/Interfaces";

export type WsConnectionStatus = "idle" | "connecting" | "online" | "offline";

interface OrdersFeedState {
    orders: OrdersFeedItem[];
    total: number;
    totalToday: number;
    status: WsConnectionStatus;
    error: string | null;
}

const initialState: OrdersFeedState = {
    orders: [],
    total: 0,
    totalToday: 0,
    status: "idle",
    error: null,
};

const ordersFeedSlice = createSlice({
    name: "ordersFeed",
    initialState,
    reducers: {
        connect(state) {
            state.status = "connecting";
            state.error = null;
        },
        disconnect() {
            return { ...initialState, status: "offline" } satisfies OrdersFeedState;
        },
        connectionSuccess(state) {
            state.status = "online";
            state.error = null;
        },
        connectionClosed() {
            return { ...initialState, status: "offline" } satisfies OrdersFeedState;
        },
        connectionError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.status = "offline";
        },
        receiveOrders(state, action: PayloadAction<OrdersFeedResponse>) {
            state.orders = action.payload.orders;
            state.total = action.payload.total;
            state.totalToday = action.payload.totalToday;
        },
    },
});

export const ordersFeedReducer = ordersFeedSlice.reducer;
export const ordersFeedActions = ordersFeedSlice.actions;
export type OrdersFeedSliceState = OrdersFeedState;
