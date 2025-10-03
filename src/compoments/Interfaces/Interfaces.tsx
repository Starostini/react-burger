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

export interface IngredientData {
  data: IngredientHead[];
}
export interface IngredientHead {
  type_id: number;
  type: "bun" | "sauce" | "main";
  name: "Булки" | "Соусы" | "Начинки";
  data: Ingredient[];
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
