import type { OrdersFeedItem } from "../compoments/Interfaces/Interfaces";
import type { StoreIngredient } from "../compoments/Interfaces/Interfaces";
import type { OrdersFeedResponse } from "../compoments/Interfaces/Interfaces";
import type { UserInfo } from "./userActions";

export const createIngredient = (overrides: Partial<StoreIngredient> = {}): StoreIngredient => ({
    id: "uniq-id",
    _id: "uniq-id",
    type: "main",
    name: "Test Ingredient",
    price: 1000,
    proteins: 100,
    fat: 250,
    carbohydrates: 100,
    calories: 250,
    images: {
        image_large: "large.png",
        image_normal: "normal.png",
        image_mobile: "mobile.png",
    },
    ...overrides,
});

export const createOrdersFeedItem = (overrides: Partial<OrdersFeedItem> = {}): OrdersFeedItem => ({
    _id: "order-id",
    ingredients: ["uniq-id-1", "uniq-id-2"],
    status: "done",
    name: "Test Order",
    createdAt: "2025-12-18T00:00:00.000Z",
    updatedAt: "2025-12-18T00:00:00.000Z",
    number: 123456,
    ...overrides,
});

export const createOrdersFeedResponse = (
    overrides: Partial<OrdersFeedResponse> = {}
): OrdersFeedResponse => ({
    success: true,
    orders: [createOrdersFeedItem()],
    total: 10,
    totalToday: 2,
    ...overrides,
});

export const createUser = (overrides: Partial<UserInfo> = {}): UserInfo => ({
    email: "testuser@myemail.com",
    name: "TestUser",
    ...overrides,
});
