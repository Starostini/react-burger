import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../services/hooks.ts";
import IngredientDetails from "./IngredientsDetail.tsx";
import styles from "./IngredientPage.module.css";
import { allIngredients, loading as ingredientsLoading, error as ingredientsError } from "../../../../services/selectors.ts";
import type { Ingredient as IngredientType, StoreIngredient } from "../../../Interfaces/Interfaces.tsx";
import { setCurrent, clearCurrent } from "../../../../services/currentIngredientSlice.ts";

const mapToIngredient = (ingredient: StoreIngredient): IngredientType => ({
    id: ingredient.id,
    type: ingredient.type,
    name: ingredient.name,
    price: ingredient.price,
    proteins: ingredient.proteins,
    fat: ingredient.fat,
    carbohydrates: ingredient.carbohydrates,
    calories: ingredient.calories,
    images: ingredient.images,
});

export const Ingredient = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const ingredients = useAppSelector(allIngredients);
    const isLoading = useAppSelector(ingredientsLoading);
    const fetchError = useAppSelector(ingredientsError);

    const ingredient = useMemo(() => {
        if (!id) {
            return null;
        }

        return ingredients.find((item) => item.id === id || item._id === id) ?? null;
    }, [id, ingredients]);

    useEffect(() => {
        if (!ingredient) {
            return undefined;
        }

        dispatch(setCurrent(ingredient));

        return () => {
            dispatch(clearCurrent());
        };
    }, [dispatch, ingredient]);

    if (isLoading && !ingredient) {
        return <p className="text text_type_main-default text_color_inactive">Загружаем данные ингредиента</p>;
    }

    if (fetchError && !ingredient) {
        return (
            <p className="text text_type_main-default text_color_inactive">
                Не удалось загрузить данные. Попробуйте еще раз.
            </p>
        );
    }

    if (!ingredient) {
        return <p className="text text_type_main-default text_color_inactive">Ингредиент не найден</p>;
    }

    return <IngredientDetails ingredient={mapToIngredient(ingredient)} />;
};

const IngredientContent = () => {
    return (
        <div className={styles.wrapper}>
            <Ingredient />
        </div>
    );
};

export default IngredientContent;
