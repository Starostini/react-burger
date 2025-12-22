import React, { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../services/hooks.ts";
import { useDrop } from "react-dnd";
import styles from "./burgerConstructor.module.css";
import {
  ConstructorElement,
  Button,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import {
  addIngredient,
  deleteIngredient,
  changeOrder,
} from "../../services/constructorSlice";
import {
  constructorBun,
  constructorItems,
  summPrice,
  orderLoading,
} from "../../services/selectors";
import type { StoreIngredient } from "../Interfaces/Interfaces.tsx";
import ConstructorItem from "./ConstructorItem";

const ASSET_BASE = import.meta.env.BASE_URL;
const BUN_IMAGE_FALLBACK = `${ASSET_BASE}images/N-200inormal.png`;

type DragCollected = {
  isHovering: boolean;
};

interface BurgerConstructorProps {
  onOrder: () => void;
}

const BurgerConstructor: React.FC<BurgerConstructorProps> = ({ onOrder }) => {
  const dispatch = useAppDispatch();
  const bun = useAppSelector(constructorBun);
  const items = useAppSelector(constructorItems);
  const total = useAppSelector(summPrice);
  const isOrderLoading = useAppSelector(orderLoading);

  const [{ isHovering: isBunHover }, bunDropRef] = useDrop<StoreIngredient, void, DragCollected>(
    () => ({
      accept: "INGREDIENT",
      canDrop: (item) => item.type === "bun",
      drop: (item) => {
        dispatch(addIngredient(item));
      },
      collect: (monitor) => ({
        isHovering: monitor.isOver() && monitor.canDrop(),
      }),
    }),
    [dispatch]
  );

  const [{ isHovering: isFillHover }, fillingsDropRef] = useDrop<
      StoreIngredient,
    void,
    DragCollected
  >(
    () => ({
      accept: "INGREDIENT",
      canDrop: (item) => item.type === "main" || item.type === "sauce",
      drop: (item) => {
        dispatch(addIngredient(item));
      },
      collect: (monitor) => ({
        isHovering: monitor.isOver() && monitor.canDrop(),
      }),
    }),
    [dispatch]
  );

  const handleMove = useCallback(
    (from: number, to: number) => {
      dispatch(changeOrder({ from, to }));
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (uid: string) => {
      dispatch(deleteIngredient(uid));
    },
    [dispatch]
  );

  const { topText, bottomText } = useMemo(() => {
    if (!bun) {
      return {
        topText: "Выберите булку",
        bottomText: "Выберите булку",
      };
    }
    return {
      topText: `${bun.name} (верх)`,
      bottomText: `${bun.name} (низ)`,
    };
  }, [bun]);

  const isOrderDisabled = !bun || items.length === 0 || isOrderLoading;

  return (
    <section className={`${styles.container} mt-25 ml-4`} data-cyid="burger-constructor">
      <div
        ref={bunDropRef}
        data-cyid="bun-drop"
        className={`${styles.buns} ${isBunHover ? styles.dropped : ""}`}
      >
        <div className="ml-8 mb-2">
          <ConstructorElement
            type="top"
            isLocked={true}
            text={topText}
            price={bun?.price ?? 0}
            thumbnail={bun?.images.image_normal ?? BUN_IMAGE_FALLBACK}
          />
        </div>
          <div
              ref={fillingsDropRef}
              data-cyid="constructor-fillings"
              className={`${styles.line} ${
                  isFillHover ? styles.dropped : ""
              }`}
          >
              {items.length > 0 ? (
                  items.map((item, index) => {
                      if (!item.uid) {
                          return null;
                      }
                      return (
                          <ConstructorItem
                              key={item.uid}
                              item={{ ...item, uid: item.uid }}
                              index={index}
                              moveItem={handleMove}
                              onRemove={handleRemove}
                          />
                      );
                  })
              ) : (
                  <p className={`${styles.empty_info} text text_type_main-default`}>
                      Перетащите начинку сюда
                  </p>
              )}
          </div>
        <div className="ml-8 mt-2">
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={bottomText}
            price={bun?.price ?? 0}
            thumbnail={bun?.images.image_normal ?? BUN_IMAGE_FALLBACK}
          />
        </div>
      </div>

      <div className={`${styles.order} mt-10 mr-4`}>
        <div>
          <span className="text text_type_digits-medium mr-2">{total}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={onOrder}
          disabled={isOrderDisabled}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

export default BurgerConstructor;
