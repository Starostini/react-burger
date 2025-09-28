import React, { useEffect, useState } from "react";
import Tabs from "../ui/tab/Tabs";
import IngredientsComponent from "../ui/ingredients/IngredientsComponent";
import stylesBurgerIngredients from "./burgerIngredients.module.css";

const BurgerIngredients = ({
  handleIngredientsAdded,
  dataIngredients,
  initialData,
}) => {
  const [data, setData] = useState(dataIngredients);
  const [activeData, setActiveData] = useState(dataIngredients);
  const [active, setActive] = useState(data[0].type);

  const tabs = data.map((item) => {
    return { type_id: item.type_id, name: item.name, type: item.type };
  });

  //Заглушка для первоначальной отрисовки счетчика
  useEffect(() => {
    initialData.forEach((item) => {
      handleButtonClick(item);
    });
  }, []);

  const handleButtonClick = (type) => {
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
    setActiveData((prevData) =>
      prevData.map((category) => ({
        ...category,
        data: category.data.map((item) =>
          item.id === type.id
            ? { ...item, counter: (item.counter || 0) + 1 }
            : item
        ),
      }))
    );
    handleIngredientsAdded(type);
  };

  const handleFilterTab = (type) => {
    setActive(type);
    setActiveData(data.filter((item) => item.type === type));
  };
  return (
    <section className={`${stylesBurgerIngredients.container} pt-10`}>
      <h1
        className={`${stylesBurgerIngredients.title} text text_type_main-large mb-5`}
      >
        Соберите бургер
      </h1>
      <Tabs props={tabs} activeTab={active} onChange={handleFilterTab} />
      <div className={`${stylesBurgerIngredients.line} pr-4`}>
        {activeData.map((item) => (
          <div
            className={`${stylesBurgerIngredients.listContainer} mb-10`}
            key={`${item.type_id}-div`}
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
                  props={{ ...ing, onClick: handleButtonClick }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BurgerIngredients;
