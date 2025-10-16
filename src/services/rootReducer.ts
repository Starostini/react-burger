import { combineReducers } from "@reduxjs/toolkit";
import { ingredientsReducer } from "./ingredientsSlice";
import { constructorReducer } from "./constructorSlice";
import { currentIngredientReducer } from "./currentIngredientSlice";
import { orderReducer } from "./orderSlice";

export const rootReducer = combineReducers({
    ingredients: ingredientsReducer,
    burgerConstructor: constructorReducer,
    currentIngredient: currentIngredientReducer,
    order: orderReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
