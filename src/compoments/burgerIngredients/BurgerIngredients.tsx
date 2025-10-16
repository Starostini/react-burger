import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "../ui/tab/Tabs";
import IngredientsComponent from "../ui/ingredients/IngredientsComponent";
import stylesBurgerIngredients from "./burgerIngredients.module.css";
import Modal from "../ui/modal/Modal";
import IngredientDetails from "../ui/modal/modalContents/IngredientsDetail";
import type { Ingredient, IngredientHead } from "../Interfaces/Interfaces";
import { useModal } from "../hooks/useModal";
import {
  constructorBun,
  constructorItems,
  currentIngredient,
    allIngredients,
} from "../../services/selectors";
import type { AppDispatch } from "../../services/store.ts";
import { setCurrent, clearCurrent } from "../../services/currentIngredientSlice";
import type { StoreIngredient } from "../Interfaces/Interfaces.tsx";

interface BurgerIngredientsProps {
  dataIngredients: IngredientHead[];
}
interface Tab {
  type_id: number;
  name: "Булки" | "Соусы" | "Начинки";
  type: "bun" | "sauce" | "main";
}
const BurgerIngredients: React.FC<BurgerIngredientsProps> = ({
  dataIngredients,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isModalOpen, openModal, closeModal } = useModal();
  const [data, setData] = useState<IngredientHead[]>([]);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [active, setActive] = useState<IngredientHead["type"] | "">("");
  const scrollerRef = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bun = useSelector(constructorBun);
  const items = useSelector(constructorItems);
  const selectedIngredient = useSelector(currentIngredient);
  const ingredients = useSelector(allIngredients);

  const preparedData = useMemo(() => {
    return data.map((section) => ({
      ...section,
      data: section.data.map((ingredient) => {
        let counter = 0;
        if (ingredient.type === "bun") {
          counter = bun && bun.id === ingredient.id ? 2 : 0;
        } else {
          counter = items.filter((item) => item.id === ingredient.id).length;
        }
        return {
          ...ingredient,
          counter,
        };
      }),
    }));
  }, [data, bun, items]);

  useEffect(() => {
    const safeData = dataIngredients;
    setData(safeData);
    const nextTabs = safeData.map((item) => ({
      type_id: item.type_id,
      name: item.name,
      type: item.type,
    }));
    setTabs(nextTabs);
    if (nextTabs.length === 0) {
      setActive("");
      return;
    }
    setActive((prevActive) => {
      if (prevActive && nextTabs.some((tab) => tab.type === prevActive)) {
        return prevActive;
      }
      return nextTabs[0].type;
    });
    scrollerRef.current = {};
  }, [dataIngredients]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return undefined;
    }

    const handleScroll = () => {
      const entries = Object.entries(scrollerRef.current);
      if (entries.length === 0) {
        return;
      }
      const containerRect = container.getBoundingClientRect();
      let closestType: IngredientHead["type"] | "";
      let minDistance = Number.POSITIVE_INFINITY;

      entries.forEach(([type, element]) => {
        if (!element) {
          return;
        }
        const distance = Math.abs(
          element.getBoundingClientRect().top - containerRect.top
        );
        if (distance < minDistance) {
          closestType = type as IngredientHead["type"] | "";
          minDistance = distance;
        }
      });

      if (closestType) {
        setActive((prev): ""|"bun"|"sauce"|"main" => (prev === closestType ? prev : closestType));
      }
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [preparedData]);

  const toStoreIngredient = (ing: Ingredient): StoreIngredient => ({
    id: ing.id,
    type: ing.type,
    name: ing.name,
    price: ing.price,
    proteins: ing.proteins,
    fat: ing.fat,
    carbohydrates: ing.carbohydrates,
    calories: ing.calories,
    images: {
      image_large: ing.images.image_large,
      image_normal: ing.images.image_normal,
      image_mobile: ing.images.image_mobile,
    },
  });

  const handleButtonClick = (ingredient: Ingredient) => {
    const original = ingredients.find((item) => item.id === ingredient.id);
    dispatch(setCurrent(original ?? toStoreIngredient(ingredient)));
    openModal();
  };

  const handleCloseModal = () => {
    dispatch(clearCurrent());
    closeModal();
  };

  const handleScrollToTab = (type: IngredientHead["type"]) => {
    setActive(type);
    const target = scrollerRef.current[type];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <section className={`${stylesBurgerIngredients.container} pt-10`}>
      <h1
        className={`${stylesBurgerIngredients.title} text text_type_main-large mb-5`}
      >
        Соберите бургер
      </h1>
      <Tabs props={tabs} activeTab={active} onChange={handleScrollToTab} />
      <div
        className={`${stylesBurgerIngredients.line} pr-4`}
        ref={scrollContainerRef}
      >
        {preparedData.map((item) => (
          <div
            className={`${stylesBurgerIngredients.listContainer} mb-10`}
            key={`${item.type_id}-div`}
            ref={(element) => {
              if (!item.type) {
                return;
              }
              if (element) {
                scrollerRef.current[item.type] = element;
              } else {
                delete scrollerRef.current[item.type];
              }
            }}
          >
            <h2
              key={`${item.type_id}-h2`}
              className="text text_type_main-medium"
            >
              {item.name}
            </h2>
            <div
              key={item.type_id}
              className={`${stylesBurgerIngredients.list} mt-6 mb-10 ml-4`}
            >
              {item.data.map((ing) => (
                <IngredientsComponent
                  key={ing.id}
                  ingredient={ing}
                  onClick={handleButtonClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && selectedIngredient ? (
        <Modal onClose={handleCloseModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      ) : null}
    </section>
  );
};

export default BurgerIngredients;
