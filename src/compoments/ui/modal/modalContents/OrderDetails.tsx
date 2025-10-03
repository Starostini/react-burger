import React from "react";
import stylesOrderDetails from "./orderDetails.module.css";
import { CheckMarkIcon } from "@ya.praktikum/react-developer-burger-ui-components";

interface OrderDetailsProps {
  orderId: string | number;
}
const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
  return (
    <>
      <h1
        className={`${stylesOrderDetails.orderNumber} text text_type_digits-large mt-30`}
      >
        {orderId}
      </h1>
      <p className="text text_type_main-medium mt-8">идентификатор заказа</p>
      <div className={`${stylesOrderDetails.vector} mt-15 mb-15 pt-10 pb-10`}>
        <img
          className={stylesOrderDetails.vectorsImg}
          src="/images/icon/Vector 1.svg"
        />
        <img
          className={stylesOrderDetails.vectorsImg}
          src="/images/icon/Vector 2.svg"
        />
        <img
          className={stylesOrderDetails.vectorsImg}
          src="/images/icon/Vector 3.svg"
        />
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
