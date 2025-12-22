import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StoreIngredient } from "../compoments/Interfaces/Interfaces";

type State = { current: StoreIngredient | null };

const initialState: State = { current: null };

const currentIngredientSlice = createSlice({
    name: "currentIngredient",
    initialState,
    reducers: {
        setCurrent(state, action: PayloadAction<StoreIngredient>) {
            state.current = action.payload;
        },
        clearCurrent(state) {
            state.current = null;
        },
    },
});

export const { setCurrent, clearCurrent } = currentIngredientSlice.actions;
export const currentIngredientReducer = currentIngredientSlice.reducer;