import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { OrderResponse, AsyncState } from "../compoments/Interfaces/Interfaces.tsx";
import { request } from "../utils/request";
import { getAccessToken } from "../utils/token";
import { clearConstructor } from "./constructorSlice";

export const createOrder = createAsyncThunk<number, string[]>(
    "order/create",
    async (data, thunkAPI) => {
        try {
            const token = getAccessToken();

            if (!token) {
                throw new Error("Необходима авторизация");
            }

            const json = await request<OrderResponse>("/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: token,
                },
                body: JSON.stringify({ ingredients: data }),
            });
            thunkAPI.dispatch(clearConstructor());
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
    reducers: {},
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
