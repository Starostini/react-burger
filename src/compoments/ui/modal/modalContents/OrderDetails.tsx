import React from "react";
import stylesOrderDetails from "./orderDetails.module.css";
import { CheckMarkIcon } from "@ya.praktikum/react-developer-burger-ui-components";

interface OrderDetailsProps {
  isLoading: boolean;
  orderNumber: number | null;
  error: string | null;
}

const ASSET_BASE = import.meta.env.BASE_URL;
const STATUS_ICONS = [
  `${ASSET_BASE}images/icon/Vector 1.svg`,
  `${ASSET_BASE}images/icon/Vector 2.svg`,
  `${ASSET_BASE}images/icon/Vector 3.svg`,
];

const OrderDetails: React.FC<OrderDetailsProps> = ({
  isLoading,
  orderNumber,
  error,
}) => {
  const renderBody = () => {
    if (isLoading) {
      return (
        <p className="text text_type_main-medium mt-8 mb-20">
          Оформляем заказ...
        </p>
      );
    }

    if (error) {
      return (
        <p className="text text_type_main-medium mt-8 mb-20">
          Ошибка: {error}
        </p>
      );
    }

    if (orderNumber) {
      return (
        <>
          <h3
            className={`${stylesOrderDetails.orderNumber} text text_type_digits-large mt-30`}
          >
            {orderNumber}
          </h3>
          <p className="text text_type_main-medium mt-8">идентификатор заказа</p>
        </>
      );
    }

    return (
      <p className="text text_type_main-medium mt-8 mb-20">
        Номер заказа будет отображён после оформления.
      </p>
    );
  };

  return (
    <>
      {renderBody()}
      <div className={`${stylesOrderDetails.vector} mt-15 mb-15 pt-10 pb-10`}>
        {STATUS_ICONS.map((src) => (
          <img key={src} className={stylesOrderDetails.vectorsImg} src={src} />
        ))}
        <CheckMarkIcon type="primary" />
      </div>
      <p className="text text_type_main-small mb-2">
        Ваш заказ начали готовить
      </p>
      <p
        className={`${stylesOrderDetails.attentionTextBottom} text text_type_main-small mb-30`}
      >
        Дождитесь готовности на орбитальной станции
      </p>
    </>
  );
};

export default OrderDetails;
