import React, { useMemo } from "react";
import { CurrencyIcon, FormattedDate } from "@ya.praktikum/react-developer-burger-ui-components";
import type { OrdersFeedItem, StoreIngredient } from "../Interfaces/Interfaces";
import styles from "./OrderInfo.module.css";

interface OrderInfoProps {
    order: OrdersFeedItem | null;
    allIngredients: StoreIngredient[];
    isLoading: boolean;
    error: string | null;
    variant?: "page" | "modal";
}

const statusTextMap: Record<OrdersFeedItem["status"], string> = {
    done: "Выполнен",
    pending: "Готовится",
    created: "Создан",
};

const OrderInfo: React.FC<OrderInfoProps> = ({ order, allIngredients, isLoading, error, variant = "page" }) => {
    const ingredientsMap = useMemo(() => {
        return allIngredients.reduce((acc, ingredient) => {
            acc.set(ingredient.id, ingredient);
            if (ingredient._id) {
                acc.set(ingredient._id, ingredient);
            }
            return acc;
        }, new Map<string, StoreIngredient>());
    }, [allIngredients]);

    const ingredientsInfo = useMemo(() => {
        if (!order) {
            return [] as Array<{ ingredient: StoreIngredient; count: number }>;
        }

        const map = new Map<string, { ingredient: StoreIngredient; count: number }>();
        order.ingredients.forEach((ingredientId) => {
            const ingredient = ingredientsMap.get(ingredientId);
            if (!ingredient) {
                return;
            }
            const key = ingredient.id;
            const current = map.get(key);
            if (current) {
                current.count += 1;
            } else {
                map.set(key, { ingredient, count: 1 });
            }
        });

        return Array.from(map.values());
    }, [ingredientsMap, order]);

    const totalPrice = useMemo(() => {
        return ingredientsInfo.reduce((sum, info) => sum + info.ingredient.price * info.count, 0);
    }, [ingredientsInfo]);

    if (isLoading) {
        return <p className="text text_type_main-default text_color_inactive">Загружаем данные заказа...</p>;
    }

    if (error) {
        return <p className="text text_type_main-default text_color_inactive">{error}</p>;
    }

    if (!order) {
        return <p className="text text_type_main-default text_color_inactive">Заказ не найден</p>;
    }

    const wrapperClass = `${styles.wrapper} ${variant === "page" ? styles.pageVariant : ""} m-10`.trim();
    const statusClass = order.status === "done" ? `${styles.status} ${styles.statusDone}` : styles.status;

    return (
        <div className={wrapperClass}>
            <p className={`${styles.centeredNumber} text text_type_digits-default`}>#{order.number}</p>
            <div>
                <p className={`${styles.name} text text_type_main-medium mb-2`}>{order.name}</p>
                <p className={`${statusClass} text text_type_main-small`}>{statusTextMap[order.status]}</p>
            </div>
            <div>
                <p className={`${styles.subtitle} text text_type_main-medium`}>Состав:</p>
                <ul className={`${styles.list} mt-6 mr-6`}>
                    {ingredientsInfo.map(({ ingredient, count }) => (
                        <li className={styles.ingredientRow} key={ingredient.id}>
                            <div className={styles.ingredientInfo}>
                                <div className={styles.ingredientIcon}>
                                    <img src={ingredient.images.image_mobile} alt={ingredient.name} />
                                </div>
                                <p className="text text_type_main-default">{ingredient.name}</p>
                            </div>
                            <div className={`${styles.price} text text_type_digits-default`}>
                                <span>
                                    {count} x {ingredient.price}
                                </span>
                                <CurrencyIcon type="primary" />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.footer}>
                <p className="text text_type_main-default text_color_inactive">
                    <FormattedDate date={new Date(order.createdAt)} />
                </p>
                <div className={`${styles.price} text text_type_digits-default`}>
                    <span>{totalPrice}</span>
                    <CurrencyIcon type="primary" />
                </div>
            </div>
        </div>
    );
};

export default OrderInfo;
