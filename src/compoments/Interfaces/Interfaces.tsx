export interface IngredientsResponse {
  success: boolean;
  data: IngredientResponseDetail[];
}
export interface IngredientResponseDetail {
  _id: string;
  name: string;
  type: "bun" | "sauce" | "main";
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
}

export interface Ingredient {
  id: string;
  type: "bun" | "sauce" | "main";
  name: string;
  price: number;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  uid?: string;
  counter?: number;
  images: {
    image_large: string;
    image_normal: string;
    image_mobile: string;
  };
}



export type AsyncState<T> = {
    data: T;
    isLoading: boolean;
    error: string | null;
};


export type StoreIngredient = {
    id: string;
    _id?: string;
    type: "bun" | "sauce" | "main";
    name: string;
    price: number;
    proteins: number;
    fat: number;
    carbohydrates: number;
    calories: number;
    images: {
        image_large: string;
        image_normal: string;
        image_mobile: string;
    };
    uid?: string;
};


export type OrderResponse = {
    name: string;
    order: { number: number };
    success: boolean;
};

export type IngredientType = "bun" | "sauce" | "main";

export type OrderStatus = "created" | "pending" | "done";

export interface OrdersFeedItem {
    _id: string;
    ingredients: string[];
    status: OrderStatus;
    name: string;
    createdAt: string;
    updatedAt: string;
    number: number;
}

export interface OrdersFeedResponse {
    success: boolean;
    orders: OrdersFeedItem[];
    total: number;
    totalToday: number;
}

export interface OrderDetailsResponse {
    success: boolean;
    orders: OrdersFeedItem[];
}
