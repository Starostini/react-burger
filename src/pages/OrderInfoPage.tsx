//@ts-expect-error React issue
import React from "react";
import { useParams } from "react-router-dom";
import OrderInfoContainer from "../compoments/orders/OrderInfoContainer";
import styles from "./OrderInfoPage.module.css";

const OrderInfoPage = () => {
    const { id } = useParams();

    return (
        <div className={`${styles.page} pt-10 pb-10`}>
            <OrderInfoContainer orderNumber={id} variant="page" />
        </div>
    );
};

export default OrderInfoPage;
