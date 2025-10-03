import React, { useEffect, useState } from "react";
import BurgerIngredients from "../burgerIngredients/BurgerIngredients";
import BurgerConstructor from "../burgerConstructor/BurgerConstructor";
import stylesMain from "./main.module.css";
import Modal from "../ui/modal/Modal";
import OrderDetails from "../ui/modal/modalContents/OrderDetails";
import ModalOverlay from "../ui/modal/ModalOverlay";
import type { Ingredient, IngredientHead } from "../Interfaces/Interfaces";

interface BunsProps extends Ingredient {
  id: string;
  uid?: string;
  name: string;
  position: "top" | "bottom";
  type: "bun";
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
}
interface MainProps {
  data: IngredientHead[];
}
const Main: React.FC<MainProps> = ({ data }) => {
  const [ingredientsData, setIngredientsData] = useState<IngredientHead[]>([]);
  const [choosenData, setChoosenData] = useState<Ingredient[]>([]);
  const [buns, setBuns] = useState<BunsProps[]>([]);
  const [showOrder, setShowOrder] = useState(false);

  useEffect(() => {
    setIngredientsData(data);
  }, [data]);
  const handleIngredientsAdded = (item: Ingredient) => {
    const isBun = item.type === "bun";

    if (isBun) {
      setBuns(() => {
        const topBun: BunsProps = {
          ...item,
          id: `${item.id}-top`,
          name: `${item.name} (верх)`,
          position: "top",
          type: "bun",
        };

        const bottomBun: BunsProps = {
          ...item,
          id: `${item.id}-bottom`,
          name: `${item.name} (низ)`,
          position: "bottom",
          type: "bun",
        };

        return [topBun, bottomBun];
      });
    } else {
      setChoosenData((prev) => {
        const newItem = {
          ...item,
          uid: crypto.randomUUID(),
        };

        return [...prev, newItem];
      });
    }
  };

  const handleOrder = () => {
    setShowOrder(true);
  };
  return (
    <main className={stylesMain.main}>
      <BurgerIngredients
        handleIngredientsAdded={handleIngredientsAdded}
        dataIngredients={ingredientsData}
      />
      <BurgerConstructor
        buns={buns}
        props={choosenData}
        onOrder={handleOrder}
      />
      {showOrder && (
        <ModalOverlay onClose={() => setShowOrder(false)}>
          <Modal onClose={() => setShowOrder(false)}>
            <OrderDetails orderId="034536" />
          </Modal>
        </ModalOverlay>
      )}
    </main>
  );
};

export default Main;
