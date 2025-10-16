import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { StoreIngredient } from "../compoments/Interfaces/Interfaces";

type ConstructorState = {
    bun: StoreIngredient | null;
    items: StoreIngredient[];
};

const initialState: ConstructorState = { bun: null, items: [] };

const constructorSlice = createSlice({
    name: "constructor",
    initialState,
    reducers: {
        addIngredient(state, action: PayloadAction<StoreIngredient>) {
            const ing = action.payload;
            if (ing.type === "bun") {
                state.bun = ing;
            } else {
                state.items.push({ ...ing, uid: nanoid() });
            }
        },
        deleteIngredient(state, action: PayloadAction<string>) {
            state.items = state.items.filter((i) => i.uid !== action.payload);
        },
        clearConstructor(state) {
            state.bun = null;
            state.items = [];
        },
        changeOrder(state, action: PayloadAction<{ from: number; to: number }>) {
            const { from, to } = action.payload;
            if (from === to) return;
            const arr = [...state.items];
            const [moved] = arr.splice(from, 1);
            arr.splice(to, 0, moved);
            state.items = arr;
        },
    },
});

export const { addIngredient, deleteIngredient, clearConstructor, changeOrder } =
    constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;
