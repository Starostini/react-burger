import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import BurgerIngredients from "../burgerIngredients/BurgerIngredients";
import BurgerConstructor from "../burgerConstructor/BurgerConstructor";
import stylesMain from "./main.module.css";
import Modal from "../ui/modal/Modal";
import OrderDetails from "../ui/modal/modalContents/OrderDetails";
import type { IngredientHead } from "../Interfaces/Interfaces";
import { useModal } from "../hooks/useModal";
import { constructorBun, constructorItems, orderError, orderLoading, orderNumberState } from "../../services/selectors";
import { createOrder } from "../../services/orderSlice";
import type { AppDispatch } from "../../services/store.ts";

interface MainProps {
  data: IngredientHead[];
}

const Main: React.FC<MainProps> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isModalOpen, openModal, closeModal } = useModal();
  const bun = useSelector(constructorBun);
  const items = useSelector(constructorItems);
  const orderNumber = useSelector(orderNumberState);
  const isOrderLoading = useSelector(orderLoading);
  const orderErr = useSelector(orderError);
  const handleOrder = useCallback(() => {
    if (!bun) {
      return;
    }
    const bunId = bun._id ?? bun.id;
    const fillingIds = items.map((item) => item._id ?? item.id);
    const ingredientIds = [bunId, ...fillingIds, bunId];
    openModal();
    dispatch(createOrder(ingredientIds));
  }, [bun, items, dispatch, openModal]);

  const handleCloseModal = useCallback(() => {
    closeModal();

  }, [closeModal, dispatch]);

  return (
    <main className={stylesMain.main}>
      <BurgerIngredients dataIngredients={data} />
      <BurgerConstructor onOrder={handleOrder} />
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <OrderDetails
            isLoading={isOrderLoading}
            orderNumber={orderNumber}
            error={orderErr}
          />
        </Modal>
      )}
    </main>
  );
};

export default Main;
