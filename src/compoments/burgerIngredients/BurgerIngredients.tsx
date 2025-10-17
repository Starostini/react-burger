import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "../ui/tab/Tabs";
import IngredientsComponent from "../ui/ingredients/IngredientsComponent";
import stylesBurgerIngredients from "./burgerIngredients.module.css";
import Modal from "../ui/modal/Modal";
import IngredientDetails from "../ui/modal/modalContents/IngredientsDetail";
import type { Ingredient } from "../Interfaces/Interfaces";
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
import { fetchIngredients } from "../../services/ingredientsSlice";

type IngredientType = StoreIngredient["type"];

type IngredientSection = {
  type_id: number;
  type: IngredientType;
  name: "Булки" | "Соусы" | "Начинки";
  data: Ingredient[];
};

interface Tab {
  type_id: number;
  name: "Булки" | "Соусы" | "Начинки";
  type: "bun" | "sauce" | "main";
}
const BurgerIngredients: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isModalOpen, openModal, closeModal } = useModal();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [active, setActive] = useState<IngredientType | "">("");
  const scrollerRef = useRef<Partial<Record<IngredientType, HTMLDivElement | null>>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bun = useSelector(constructorBun);
  const items = useSelector(constructorItems);
  const selectedIngredient = useSelector(currentIngredient);
  const ingredients = useSelector(allIngredients);

  useEffect(() => {
    if (!ingredients || ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients]);

  const dataIngredients = useMemo(() => {
    if (!ingredients || ingredients.length === 0) {
      return [] as IngredientSection[];
    }

    const typeMeta: Record<IngredientType, { type_id: number; name: IngredientSection["name"] }> = {
      bun: { type_id: 1, name: "Булки" },
        main: { type_id: 2, name: "Начинки" },
      sauce: { type_id: 3, name: "Соусы" },

    };

    const grouped: Record<IngredientType, Ingredient[]> = {
      bun: [],
      sauce: [],
      main: [],
    };

    ingredients.forEach((item) => {
      const type = item.type as IngredientType;
      if (!typeMeta[type]) {
        return;
      }
      grouped[type].push({
        ...item,
      });
    });

    return (Object.keys(typeMeta) as IngredientType[])
      .map((type) => ({
        type_id: typeMeta[type].type_id,
        type,
        name: typeMeta[type].name,
        data: grouped[type],
      }))
      .filter((section) => section.data.length > 0);
  }, [ingredients]);

  const preparedData = useMemo(() => {
    return dataIngredients.map((section) => ({
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
  }, [dataIngredients, bun, items]);

  useEffect(() => {
    const nextTabs = dataIngredients.map((item) => ({
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
      let closestType: IngredientType | "" = "";
      let minDistance = Number.POSITIVE_INFINITY;

      entries.forEach(([type, element]) => {
        if (!element) {
          return;
        }
        const distance = Math.abs(
          element.getBoundingClientRect().top - containerRect.top
        );
        if (distance < minDistance) {
          closestType = type as IngredientType;
          minDistance = distance;
        }
      });

      if (closestType) {
        setActive((prev): IngredientType | "" => (prev === closestType ? prev : closestType));
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

  const handleScrollToTab = (type: IngredientType) => {
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
