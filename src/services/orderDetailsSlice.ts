import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { OrdersFeedItem, OrderDetailsResponse } from "../compoments/Interfaces/Interfaces";
import type { AsyncState } from "../compoments/Interfaces/Interfaces";
import { request } from "../utils/request";

interface OrderDetailsState extends AsyncState<OrdersFeedItem | null> {
    orderNumber: number | null;
}

const initialState: OrderDetailsState = {
    data: null,
    isLoading: false,
    error: null,
    orderNumber: null,
};

export const fetchOrderByNumber = createAsyncThunk<OrdersFeedItem, string>(
    "orderDetails/fetch",
    async (orderNumber, thunkAPI) => {
        try {
            const response = await request<OrderDetailsResponse>(`/orders/${orderNumber}`);
            const [order] = response.orders;

            if (!order) {
                throw new Error("Заказ не найден");
            }

            return order;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }

            return thunkAPI.rejectWithValue("Не удалось получить заказ");
        }
    }
);

const orderDetailsSlice = createSlice({
    name: "orderDetails",
    initialState,
    reducers: {
        clearOrderDetails() {
            return { ...initialState } satisfies OrderDetailsState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderByNumber.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
                const orderNumber = Number(action.meta.arg);
                state.orderNumber = Number.isNaN(orderNumber) ? null : orderNumber;
            })
            .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.orderNumber = action.payload.number;
            })
            .addCase(fetchOrderByNumber.rejected, (state, action) => {
                state.isLoading = false;
                state.error = (action.payload ?? action.error.message ?? null) as string | null;
            });
    },
});

export const { clearOrderDetails } = orderDetailsSlice.actions;
export const orderDetailsReducer = orderDetailsSlice.reducer;
