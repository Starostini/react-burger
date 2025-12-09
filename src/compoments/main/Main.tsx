import React, { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../services/hooks.ts";
import { useLocation, useNavigate } from "react-router-dom";
import BurgerIngredients from "../burgerIngredients/BurgerIngredients";
import BurgerConstructor from "../burgerConstructor/BurgerConstructor";
import stylesMain from "./main.module.css";
import Modal from "../ui/modal/Modal";
import OrderDetails from "../ui/modal/modalContents/OrderDetails";
import ErrorMessage from "../ui/modal/modalContents/ErrorMessage";
import { useModal } from "../hooks/useModal";
import {
  constructorBun,
  constructorItems,
  orderError,
  orderLoading,
  orderNumberState,
  loading,
  error,
  currentUser,
  isAuthChecked,
} from "../../services/selectors";
import { createOrder } from "../../services/orderSlice";
import AlertModal from "../ui/modal/modalContents/AlertModal.tsx";

const Main: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isModalOpen: isOrderModalOpen,
    openModal: openOrderModal,
    closeModal: closeOrderModal,
  } = useModal();
  const {
    isModalOpen: isErrorModalOpen,
    openModal: openErrorModal,
    closeModal: closeErrorModal,
  } = useModal();
  const bun = useAppSelector(constructorBun);
  const items = useAppSelector(constructorItems);
  const orderNumber = useAppSelector(orderNumberState);
  const isOrderLoading = useAppSelector(orderLoading);
  const orderErr = useAppSelector(orderError);
  const isIngredientsLoading = useAppSelector(loading);
  const ingredientsError = useAppSelector(error);
  const user = useAppSelector(currentUser);
  const authChecked = useAppSelector(isAuthChecked);

  useEffect(() => {
    if (ingredientsError) {
      openErrorModal();
    } else {
      closeErrorModal();
    }
  }, [ingredientsError, openErrorModal, closeErrorModal]);

  const handleOrder = useCallback(() => {
    if (!bun) {
      return;
    }

    if (authChecked && !user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!user) {
      return;
    }

    const bunId = bun._id ?? bun.id;
    const fillingIds = items.map((item) => item._id ?? item.id);
    const ingredientIds = [bunId, ...fillingIds, bunId];
    openOrderModal();
    dispatch(createOrder(ingredientIds));
  }, [authChecked, bun, dispatch, items, location, navigate, openOrderModal, user]);

  const handleCloseModal = useCallback(() => {
    closeOrderModal();
  }, [closeOrderModal]);

  return (
    <main className={stylesMain.main}>
      {isIngredientsLoading && <Modal onClose={closeErrorModal}>
          <AlertModal message={"Loading..."}/>  </Modal>}
      {!isIngredientsLoading && !ingredientsError && (
        <>
          <BurgerIngredients />
          <BurgerConstructor onOrder={handleOrder} />
        </>
      )}
      {isOrderModalOpen && (
        <Modal onClose={handleCloseModal}>
          <OrderDetails
            isLoading={isOrderLoading}
            orderNumber={orderNumber}
            error={orderErr}
          />
        </Modal>
      )}
      {isErrorModalOpen && ingredientsError && (
        <Modal onClose={closeErrorModal}>
          <ErrorMessage message={ingredientsError} />
        </Modal>
      )}
    </main>
  );
};

export default Main;
