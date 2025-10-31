import type { RootState } from "./rootReducer";

export const allIngredients = (state: RootState) => {
    return state.ingredients.data
};
export const loading = (state: RootState) => state.ingredients.isLoading;
export const error = (state: RootState) => state.ingredients.error;

export const constructorBun = (state: RootState) => state.burgerConstructor?.bun ?? null;
export const constructorItems = (state: RootState) =>
    (state.burgerConstructor?.items);

export const currentIngredient = (state: RootState) => state.currentIngredient.current;

export const orderNumberState = (state: RootState) => state.order.data.number;
export const orderLoading = (state: RootState) => state.order.isLoading;
export const orderError = (state: RootState) => state.order.error;

export const summPrice = (state: RootState) => {
    const bun = state.burgerConstructor?.bun ?? null;
    const items = state.burgerConstructor?.items ?? [];
    const bunTotal = bun ? bun.price * 2 : 0;
    const others = items.reduce((sum, i) => sum + i.price, 0);
    return bunTotal + others;
};

export const currentUser = (state: RootState) => state.user.data;
export const userLoading = (state: RootState) => state.user.isLoading;
export const userError = (state: RootState) => state.user.error;
export const isAuthChecked = (state: RootState) => state.user.isAuthChecked;
