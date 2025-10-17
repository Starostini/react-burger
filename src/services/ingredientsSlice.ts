import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {StoreIngredient } from "../compoments/Interfaces/Interfaces";
import type {IngredientResponseDetail, AsyncState} from "../compoments/Interfaces/Interfaces.tsx";
import {BASE_URL} from "../base.ts";




export const fetchIngredients = createAsyncThunk<StoreIngredient[]>(
    "ingredients/fetch",
    async (_, thunkAPI) => {
        const API_URL = `${BASE_URL}/ingredients`;
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                const errorRes = await response.json().catch();
                throw new Error(`${response.status} ${errorRes?.message ?? ""}`.trim());
            }

            const json = await response.json();

            console.log(json)

            const formatted: StoreIngredient[] = json.data.map((i: IngredientResponseDetail) => ({
                id: i._id,
                _id: i._id,
                type: i.type,
                name: i.name,
                price: i.price,
                proteins: i.proteins,
                fat: i.fat,
                carbohydrates: i.carbohydrates,
                calories: i.calories,
                images: {
                    image_large: i.image_large,
                    image_normal: i.image,
                    image_mobile: i.image_mobile,
                },
            }));
            return formatted;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message ?? "Failed to fetch");
        }
    }
);

type IngredientsState = AsyncState<StoreIngredient[]>;

const initialState: IngredientsState = {
    data: [],
    isLoading: false,
    error: null,
};

const ingredientsSlice = createSlice({
    name: "ingredients",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchIngredients.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchIngredients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchIngredients.rejected, (state, action) => {
                state.isLoading = false;
                state.error = String(action.payload ?? action.error.message);
            });
    },
});

export const ingredientsReducer = ingredientsSlice.reducer;