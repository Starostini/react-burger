import React, { useEffect } from "react";
import OrderInfo from "./OrderInfo";
import { useOrderDetails } from "../hooks/useOrderDetails";
import { useAppDispatch, useAppSelector } from "../../services/hooks";
import { allIngredients } from "../../services/selectors";
import { clearOrderDetails } from "../../services/orderDetailsSlice";

interface OrderInfoContainerProps {
    orderNumber?: string;
    variant?: "page" | "modal";
}

const OrderInfoContainer: React.FC<OrderInfoContainerProps> = ({ orderNumber, variant = "page" }) => {
    const dispatch = useAppDispatch();
    const ingredients = useAppSelector(allIngredients);
    const { order, isLoading, error } = useOrderDetails(orderNumber);

    useEffect(
        () => () => {
            dispatch(clearOrderDetails());
        },
        [dispatch]
    );

    return (
        <OrderInfo order={order} allIngredients={ingredients ?? []} isLoading={isLoading} error={error ?? null} variant={variant} />
    );
};

export default OrderInfoContainer;
