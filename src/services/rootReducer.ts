import { combineReducers } from "@reduxjs/toolkit";
import { ingredientsReducer } from "./ingredientsSlice";
import { constructorReducer } from "./constructorSlice";
import { currentIngredientReducer } from "./currentIngredientSlice";
import { orderReducer } from "./orderSlice";
import { userReducer } from "./userSlice";
import { ordersFeedReducer } from "./ordersFeedSlice";
import { userOrdersReducer } from "./userOrdersSlice";
import { orderDetailsReducer } from "./orderDetailsSlice";

export const rootReducer = combineReducers({
    ingredients: ingredientsReducer,
    burgerConstructor: constructorReducer,
    currentIngredient: currentIngredientReducer,
    order: orderReducer,
    user: userReducer,
    ordersFeed: ordersFeedReducer,
    userOrders: userOrdersReducer,
    orderDetails: orderDetailsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
