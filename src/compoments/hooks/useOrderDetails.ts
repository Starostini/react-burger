import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../services/hooks";
import {
    feedOrderByNumber,
    orderDetailsData,
    orderDetailsError,
    orderDetailsLoading,
    userOrderByNumber,
} from "../../services/selectors";
import { fetchOrderByNumber } from "../../services/orderDetailsSlice";

export const useOrderDetails = (orderNumberParam?: string) => {
    const dispatch = useAppDispatch();
    const orderNumber = useMemo(() => {
        if (!orderNumberParam) {
            return null;
        }
        const parsed = Number(orderNumberParam);
        return Number.isNaN(parsed) ? null : parsed;
    }, [orderNumberParam]);
    const hasInvalidParam = Boolean(orderNumberParam && orderNumber === null);

    const orderFromFeed = useAppSelector((state) => (orderNumber ? feedOrderByNumber(state, orderNumber) : null));
    const orderFromUser = useAppSelector((state) => (orderNumber ? userOrderByNumber(state, orderNumber) : null));
    const detailsOrder = useAppSelector(orderDetailsData);
    const isLoading = useAppSelector(orderDetailsLoading);
    const error = useAppSelector(orderDetailsError);

    useEffect(() => {
        if (!orderNumber) {
            return;
        }

        if (orderFromFeed || orderFromUser) {
            return;
        }

        dispatch(fetchOrderByNumber(String(orderNumber)));
    }, [dispatch, orderNumber, orderFromFeed, orderFromUser]);

    const order = orderFromFeed ?? orderFromUser ?? detailsOrder;

    return {
        order,
        isLoading: !order && isLoading,
        error: order ? null : hasInvalidParam ? "Некорректный номер заказа" : error,
        orderNumber,
    } as const;
};
