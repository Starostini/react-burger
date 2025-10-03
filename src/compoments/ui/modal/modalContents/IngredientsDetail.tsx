import React from "react";
import stylesIngredientsDetail from "./IngredientsDetails.module.css";
import type { Ingredient } from "../../../Interfaces/Interfaces";

interface IngredientDetailsProps {
  ingredient: Ingredient;
}
const IngredientDetails: React.FC<IngredientDetailsProps> = ({
  ingredient,
}) => {
  const { name, images, calories, proteins, fat, carbohydrates } = ingredient;
  const text_styles = "text text_type_main-default text_color_inactive mb-2";
  const digit_styles = "text text_type_digits-default text_color_inactive";
  return (
    <div className={stylesIngredientsDetail.container}>
      <h3
        className={`${stylesIngredientsDetail.title} text text_type_main-large mt-10 ml-10`}
      >
        Детали ингредиента
      </h3>
      <img
        src={images.image_large}
        alt={name}
        className={stylesIngredientsDetail.image}
      />
      <h3 className="text text_type_main-medium mt-4 mb-8">{name}</h3>
      <ul className={`${stylesIngredientsDetail.nutrition} mb-15`}>
        <li className={stylesIngredientsDetail.item}>
          <p className={text_styles}>Калории, ккал</p>
          <p className={digit_styles}>{calories}</p>
        </li>
        <li className={stylesIngredientsDetail.item}>
          <p className={text_styles}>Белки, г</p>
          <p className={digit_styles}>{proteins}</p>
        </li>
        <li className={stylesIngredientsDetail.item}>
          <p className={text_styles}>Жиры, г</p>
          <p className={digit_styles}>{fat}</p>
        </li>
        <li className={stylesIngredientsDetail.item}>
          <p className={text_styles}>Углеводы, г</p>
          <p className={digit_styles}>{carbohydrates}</p>
        </li>
      </ul>
    </div>
  );
};

export default IngredientDetails;
