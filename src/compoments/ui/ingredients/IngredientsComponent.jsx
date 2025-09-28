import React from "react";
import stylesIngredients from "./ingredientsComponents.module.css";
import {
  CurrencyIcon,
  Counter,
} from "@ya.praktikum/react-developer-burger-ui-components";
const IngredientsComponent = ({ props }) => {
  const { name, price, images, onClick, counter } = props;

  return (
    <div className={`${stylesIngredients.card}`} onClick={() => onClick(props)}>
      {counter > 0 && <Counter count={counter} size="default" />}
      <img alt={name} src={images.image_normal} className="ml-4 mr-4" />
      <div className={stylesIngredients.info}>
        <div className={`${stylesIngredients.priceContainer}  mt-1 mb-1`}>
          <span className="text text_type_digits-default">{price}</span>
          <CurrencyIcon type="primary" />
        </div>
        <span className="text text_type_main-small">{name}</span>
      </div>
    </div>
  );
};

export default IngredientsComponent;
