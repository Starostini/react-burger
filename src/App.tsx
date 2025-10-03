import React, { useEffect } from "react";
import { useState } from "react";
import "./App.css";
import Main from "./compoments/main/Main.js";
import AppHeader from "./compoments/header/AppHeader.js";
import Modal from "./compoments/ui/modal/Modal.js";
import ModalOverlay from "./compoments/ui/modal/ModalOverlay.js";
import ErrorMessage from "./compoments/ui/modal/modalContents/ErrorMessage.js";
import type {
  IngredientResponseDetail,
  IngredientHead,
} from "./compoments/Interfaces/Interfaces.js";
function App() {
  const API_URL = "https://norma.nomoreparties.space/api/ingredients";
  const [data, setData] = useState<IngredientHead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(
            `Ошибка: ${await errorResponse.status} ${errorResponse?.message}`
          );
        }

        const result = await response.json();
        const sorted = formatData(result.data).sort(
          (a, b) => a.type_id - b.type_id
        );
        console.log(sorted);

        setData(sorted);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setError(`Ошибка при выполнении запроса: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  const formatData = (data: IngredientResponseDetail[]) => {
    const allowedTypes = ["bun", "sauce", "main"] as const;
    const headType = {
      bun: { type_id: 1, type: "bun", name: "Булки" },
      sauce: { type_id: 2, type: "sauce", name: "Соусы" },
      main: { type_id: 3, type: "main", name: "Начинки" },
    };

    const preparedData: {
      [key in "bun" | "sauce" | "main"]?: IngredientHead;
    } = {};

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

      preparedData[typeKey].data.push({
        id: item._id,
        type: typeKey,
        name: item.name,
        price: item.price,
        proteins: item.proteins,
        fat: item.fat,
        carbohydrates: item.carbohydrates,
        calories: item.calories,
        images: {
          image_large: item.image_large,
          image_normal: item.image,
          image_mobile: item.image_mobile,
        },
      });
    });

    return Object.values(preparedData);
  };

  return (
    <>
      <AppHeader />

      {isLoading && <div>Loading</div>}
      {!isLoading && !error && <Main data={data} />}
      {error && (
        <ModalOverlay onClose={() => setError(null)}>
          <Modal onClose={() => setError(null)}>
            <ErrorMessage message={error} />
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
}

export default App;
