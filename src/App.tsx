import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import type { AppDispatch } from "./services/store.ts";
import { fetchIngredients } from "./services/ingredientsSlice.ts";
import { allIngredients, error, loading } from "./services/selectors.ts";
import Main from "./compoments/main/Main.tsx";
import AppHeader from "./compoments/header/AppHeader.tsx";
import Modal from "./compoments/ui/modal/Modal.tsx";
import ErrorMessage from "./compoments/ui/modal/modalContents/ErrorMessage.tsx";
import type {
    IngredientHead,
    Ingredient,
} from "./compoments/Interfaces/Interfaces.tsx";
import { useModal } from "./compoments/hooks/useModal.tsx";

function App() {

  const { isModalOpen, closeModal, openModal } = useModal();
  const dispatch = useDispatch<AppDispatch>();

  const ingredients = useSelector(allIngredients);
  const isLoading = useSelector(loading);
  const isError = useSelector(error);

  useEffect(() => {
      dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    if (isError) openModal();
  }, [isError]);

  function formatData(data: Ingredient[]): IngredientHead[] {
    const allowedTypes = ["bun", "sauce", "main"] as const;
    const headType = {
      bun: { type_id: 1, type: "bun", name: "Булки" },
      sauce: { type_id: 2, type: "sauce", name: "Соусы" },
      main: { type_id: 3, type: "main", name: "Начинки" },
    } as const;

    const preparedData: { [key in "bun" | "sauce" | "main"]?: IngredientHead } = {};

    data.forEach((item) => {
      if (!allowedTypes.includes(item.type)) return;
      const typeKey = item.type as (typeof allowedTypes)[number];
      const detailedData = headType[typeKey];
      if (!detailedData) return;

      if (!preparedData[typeKey]) {
        preparedData[typeKey] = {
          type_id: detailedData.type_id,
          type: typeKey,
          name: detailedData.name as "Булки" | "Соусы" | "Начинки",
          data: [],
        };
      }
      preparedData[typeKey]!.data.push({
        id: item.id,
          // _id: item._id,
        type: typeKey,
        name: item.name,
        price: item.price,
        proteins: item.proteins,
        fat: item.fat,
        carbohydrates: item.carbohydrates,
        calories: item.calories,
        images: {
          image_large: item.images.image_large,
          image_normal: item.images.image_normal,
          image_mobile: item.images.image_mobile,
        },
      });
    });

    return Object.values(preparedData);
  }

  const data = React.useMemo(() => formatData(ingredients as Ingredient[]), [ingredients]);

  return (
      <DndProvider backend={HTML5Backend}>
        <>
          <AppHeader />
          {/* //TODO: Дописать модалку загрузки
          // + подумать над объединением модалок загрузки и ошибки в общую модалку и использования useModal */}
          {isLoading && <div>Loading</div>}
          {!isLoading && !isError && <Main data={data} />}
          {isModalOpen && (
            <Modal onClose={closeModal}>
              <ErrorMessage message={isError} />
            </Modal>
          )}
        </>
      </DndProvider>
  );
}

export default App;
