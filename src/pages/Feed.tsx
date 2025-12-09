import React, { useEffect, useMemo } from "react";
import OrderCard from "../compoments/orders/OrderCard";
import styles from "./FeedPage.module.css";
import { useAppDispatch, useAppSelector } from "../services/hooks";
import { ordersFeedActions } from "../services/ordersFeedSlice";
import { allIngredients, feedError, feedOrders, feedStatus, feedTotals } from "../services/selectors";

const FeedPage = () => {
    const dispatch = useAppDispatch();
    const orders = useAppSelector(feedOrders);
    const { total, totalToday } = useAppSelector(feedTotals);
    const status = useAppSelector(feedStatus);
    const error = useAppSelector(feedError);
    const ingredients = useAppSelector(allIngredients);

    useEffect(() => {
        dispatch(ordersFeedActions.connect());
        return () => {
            dispatch(ordersFeedActions.disconnect());
        };
    }, [dispatch]);

    const statusOrders = useMemo(() => {
        const readyNumbers: number[] = [];
        const inProgressNumbers: number[] = [];

        orders.forEach((order) => {
            if (order.status === "done") {
                readyNumbers.push(order.number);
                return;
            }

            if (order.status === "pending" || order.status === "created") {
                inProgressNumbers.push(order.number);
            }
        });

        const splitIntoColumns = (numbers: number[]) => {
            if (!numbers.length) {
                return [[]];
            }

            const result: number[][] = [];
            for (let i = 0; i < numbers.length; i += 10) {
                result.push(numbers.slice(i, i + 10));
            }
            return result;
        };

        return {
            readyColumns: splitIntoColumns(readyNumbers),
            inProgressColumns: splitIntoColumns(inProgressNumbers),
        };
    }, [orders]);

    const renderList = () => {
        if (status === "connecting") {
            return <p className={`${styles.message} text text_type_main-default`}>Подключаемся к серверу...</p>;
        }

        if (error) {
            return (
                <p className={`${styles.message} text text_type_main-default`}>
                    Не удалось загрузить заказы: {error}
                </p>
            );
        }

        if (!orders.length) {
            return <p className={`${styles.message} text text_type_main-default`}>Заказы скоро появятся</p>;
        }

        return (
            <div className={`${styles.ordersList} pr-4`}>
                {orders.map((order) => (
                    <OrderCard key={order._id} order={order} ingredients={ingredients ?? []} href={`/feed/${order.number}`} />
                ))}
            </div>
        );
    };

    const totalFormatted = total.toLocaleString("ru-RU");
    const totalTodayFormatted = totalToday.toLocaleString("ru-RU");

    return (
        <div className={styles.page}>
            <section className={styles.feed}>
                <h1 className="text text_type_main-large">Лента заказов</h1>
                {renderList()}
            </section>
            <section className={styles.summary}>
                <div className={`${styles.statusLists} pt-15`}>
                    <div className={styles.statusColumn}>
                        <p className={`text text_type_main-medium mb-6`}>Готовы:</p>
                        <div className={`${styles.statusList} ${styles.readyList} text text_type_digits-default`}>
                            {statusOrders.readyColumns.map((column, columnIndex) => (
                                <div className={styles.statusSubColumn} key={`ready-${columnIndex}`}>
                                    {column.length === 0 && columnIndex === 0 && <span className={styles.statusPlaceholder}>—</span>}
                                    {column.map((number) => (
                                        <span key={number}>{number}</span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.statusColumn}>
                        <p className={`text text_type_main-medium mb-6`}>В работе:</p>
                        <div className={`${styles.statusList} ${styles.pendingList} text text_type_digits-default`}>
                            {statusOrders.inProgressColumns.map((column, columnIndex) => (
                                <div className={styles.statusSubColumn} key={`pending-${columnIndex}`}>
                                    {column.length === 0 && columnIndex === 0 && <span className={styles.statusPlaceholder}>—</span>}
                                    {column.map((number) => (
                                        <span key={number}>{number}</span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.totalCard}>
                    <p className="text text_type_main-medium">Выполнено за все время:</p>
                    <p className={`text text_type_digits-large ${styles.statusTotal}`}>{totalFormatted}</p>
                </div>
                <div className={styles.totalCard}>
                    <p className="text text_type_main-medium">Выполнено за сегодня:</p>
                    <p className={`text text_type_digits-large ${styles.statusTotal}`}>{totalTodayFormatted}</p>
                </div>
            </section>
        </div>
    );
};

export default FeedPage;
