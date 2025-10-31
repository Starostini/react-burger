import { combineReducers } from "@reduxjs/toolkit";
import { ingredientsReducer } from "./ingredientsSlice";
import { constructorReducer } from "./constructorSlice";
import { currentIngredientReducer } from "./currentIngredientSlice";
import { orderReducer } from "./orderSlice";
import { userReducer } from "./userSlice";

export const rootReducer = combineReducers({
    ingredients: ingredientsReducer,
    burgerConstructor: constructorReducer,
    currentIngredient: currentIngredientReducer,
    order: orderReducer,
    user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
