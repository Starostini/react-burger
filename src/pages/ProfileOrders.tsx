import React, { useEffect, useMemo } from "react";
import styles from "./ProfileStyle.module.css";
import OrderCard from "../compoments/orders/OrderCard";
import { useAppDispatch, useAppSelector } from "../services/hooks";
import { userOrdersActions } from "../services/userOrdersSlice";
import { allIngredients, userOrders as userOrdersSelector, userOrdersError, userOrdersStatus } from "../services/selectors";

const ProfileOrders = () => {
    const dispatch = useAppDispatch();
    const orders = useAppSelector(userOrdersSelector);
    const status = useAppSelector(userOrdersStatus);
    const error = useAppSelector(userOrdersError);
    const ingredients = useAppSelector(allIngredients);

    useEffect(() => {
        dispatch(userOrdersActions.connect());
        return () => {
            dispatch(userOrdersActions.disconnect());
        };
    }, [dispatch]);

    const sortedOrders = useMemo(() => {
        return [...orders].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [orders]);

    return (
        <div className={styles.ordersContainer}>
            {status === "connecting" && (
                <p className={`${styles.ordersMessage} text text_type_main-default`}>
                    Загружаем список заказов...
                </p>
            )}
            {error && (
                <p className={`${styles.ordersMessage} text text_type_main-default`}>
                    Не удалось загрузить заказы: {error}
                </p>
            )}
            <div className={styles.ordersList}>
                {sortedOrders.map((order) => (
                    <OrderCard
                        key={order._id}
                        order={order}
                        ingredients={ingredients ?? []}
                        href={`/profile/orders/${order.number}`}
                        showStatus
                    />
                ))}
            </div>
            {!orders.length && status !== "connecting" && !error && (
                <p className={`${styles.ordersMessage} text text_type_main-default`}>
                    Вы еще не оформили ни одного заказа
                </p>
            )}
        </div>
    );
};

export default ProfileOrders;
