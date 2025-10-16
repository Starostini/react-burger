import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { OrderResponse, AsyncState } from "../compoments/Interfaces/Interfaces.tsx";

const URL_API = "https://norma.nomoreparties.space/api/orders";

export const createOrder = createAsyncThunk<number, string[]>(
    "order/create",
    async (data, thunkAPI) => {
        try {
            const response = await fetch(URL_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ingredients: data }),
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(`${response.status} ${err?.message ?? ""}`.trim());
            }
            const json: OrderResponse = await response.json();
            return json.order.number;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message ?? "Order failed");
        }
    }
);

type OrderState = AsyncState<{ number: number | null }>;

const initialState: OrderState = {
    data: { number: null },
    isLoading: false,
    error: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.number = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = String(action.payload ?? action.error.message);
            });
    },
});


export const orderReducer = orderSlice.reducer;