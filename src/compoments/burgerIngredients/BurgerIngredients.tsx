import React, { useEffect, useRef, useState } from "react";
import Tabs from "../ui/tab/Tabs";
import IngredientsComponent from "../ui/ingredients/IngredientsComponent";
import stylesBurgerIngredients from "./burgerIngredients.module.css";
import Modal from "../ui/modal/Modal";
import IngredientDetails from "../ui/modal/modalContents/IngredientsDetail";
import ModalOverlay from "../ui/modal/ModalOverlay";
import type { Ingredient, IngredientHead } from "../Interfaces/Interfaces";

interface BurgerIngredientsProps {
  handleIngredientsAdded: (ingredient: Ingredient) => void;
  dataIngredients: IngredientHead[];
}
interface Tab {
  type_id: number;
  name: "Булки" | "Соусы" | "Начинки";
  type: "bun" | "sauce" | "main";
}
const BurgerIngredients: React.FC<BurgerIngredientsProps> = ({
  handleIngredientsAdded,
  dataIngredients,
}) => {
  const [data, setData] = useState<IngredientHead[]>([]);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [active, setActive] = useState<IngredientHead["type"] | "">("");
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const scrollerRef = useRef<Record<string, HTMLDivElement | null>>({});

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

  const handleButtonClick = (type: Ingredient) => {
    setData((prevData) =>
      prevData.map((category) => ({
        ...category,
        data: category.data.map((item) =>
          item.id === type.id
            ? { ...item, counter: (item.counter || 0) + 1 }
            : item
        ),
      }))
    );
    setSelectedIngredient(type);
    setShowDetail(true);
    handleIngredientsAdded(type);
  };

  const handleCloseModal = () => {
    setShowDetail(false);
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
      <div className={`${stylesBurgerIngredients.line} pr-3`}>
        {data.map((item) => (
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
      {showDetail && selectedIngredient ? (
        <ModalOverlay onClose={handleCloseModal}>
          <Modal onClose={handleCloseModal}>
            <IngredientDetails ingredient={selectedIngredient} />
          </Modal>
        </ModalOverlay>
      ) : null}
    </section>
  );
};

export default BurgerIngredients;
