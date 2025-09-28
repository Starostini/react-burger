import React, { useEffect, useState } from "react";
import BurgerIngredients from "../burgerIngredients/BurgerIngredients";
import BurgerConstructor from "../burgerConstructor/BurgerConstructor";
import stylesMain from "./main.module.css";
import { fake, initialData } from "../../utils/data";

const Main = () => {
  const [ingredientsData, setIngredientsData] = useState([]);
  const [buns, setBuns] = useState([]);

  const handleIngredientsAdded = (item) => {
    const isBun = item.type === "buns";

    if (isBun) {
      setBuns(() => {
        const topBun = {
          ...item,
          id: `${item.id}-top`,
          name: `${item.name} (верх)`,
          position: "top",
        };

        const bottomBun = {
          ...item,
          id: `${item.id}-bottom`,
          name: `${item.name} (низ)`,
          position: "bottom",
        };

        return [topBun, bottomBun];
      });
    } else {
      setIngredientsData((prev) => {
        const newItem = {
          ...item,
          uid: `uid-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        };

        return [...prev, newItem];
      });
    }
  };

  return (
    <main className={stylesMain.main}>
      <BurgerIngredients
        handleIngredientsAdded={handleIngredientsAdded}
        dataIngredients={fake}
        initialData={initialData}
      />
      <BurgerConstructor buns={buns} props={ingredientsData} />
    </main>
  );
};

export default Main;
