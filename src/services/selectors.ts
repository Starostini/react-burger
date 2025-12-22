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

export const feedOrders = (state: RootState) => state.ordersFeed.orders;
export const feedTotals = (state: RootState) => ({
    total: state.ordersFeed.total,
    totalToday: state.ordersFeed.totalToday,
});
export const feedStatus = (state: RootState) => state.ordersFeed.status;
export const feedError = (state: RootState) => state.ordersFeed.error;
export const feedOrderByNumber = (state: RootState, orderNumber: number) =>
    state.ordersFeed.orders.find((order) => order.number === orderNumber) ?? null;

export const userOrders = (state: RootState) => state.userOrders.orders;
export const userOrdersStatus = (state: RootState) => state.userOrders.status;
export const userOrdersError = (state: RootState) => state.userOrders.error;
export const userOrderByNumber = (state: RootState, orderNumber: number) =>
    state.userOrders.orders.find((order) => order.number === orderNumber) ?? null;

export const orderDetailsData = (state: RootState) => state.orderDetails.data;
export const orderDetailsLoading = (state: RootState) => state.orderDetails.isLoading;
export const orderDetailsError = (state: RootState) => state.orderDetails.error;
