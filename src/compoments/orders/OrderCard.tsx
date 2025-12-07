import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { CurrencyIcon, FormattedDate } from "@ya.praktikum/react-developer-burger-ui-components";
import type { OrdersFeedItem, StoreIngredient } from "../Interfaces/Interfaces";
import styles from "./OrderCard.module.css";

interface OrderCardProps {
    order: OrdersFeedItem;
    ingredients: StoreIngredient[];
    href: string;
    showStatus?: boolean;
    className?: string;
}

const statusTextMap: Record<OrdersFeedItem["status"], string> = {
    done: "Выполнен",
    pending: "Готовится",
    created: "Создан",
};

const OrderCard: React.FC<OrderCardProps> = ({ order, ingredients, href, showStatus = false, className }) => {
    const location = useLocation();

    const orderIngredients = useMemo(() => {
        return order.ingredients
            .map((ingredientId) =>
                ingredients.find((ingredient) => ingredient.id === ingredientId || ingredient._id === ingredientId) ?? null
            )
            .filter((item): item is StoreIngredient => Boolean(item));
    }, [ingredients, order.ingredients]);

    const totalPrice = useMemo(
        () => orderIngredients.reduce((sum, ingredient) => sum + ingredient.price, 0),
        [orderIngredients]
    );

    const maxVisible = 6;
    const visibleIngredients = orderIngredients.slice(0, maxVisible);
    const hiddenCount = orderIngredients.length - visibleIngredients.length;

    const statusClass = order.status === "done" ? `${styles.status} ${styles.statusDone}` : styles.status;

    return (
        <Link
            to={href}
            state={{ backgroundLocation: location }}
            className={`${styles.link} ${className ?? ""}`.trim()}
        >
            <article className={`${styles.card} text text_type_main-small p-6`}>
                <div className={styles.header}>
                    <p className={`${styles.number} text text_type_digits-default`}>#{order.number}</p>
                    <p className="text text_type_main-default text_color_inactive">
                        <FormattedDate date={new Date(order.createdAt)} />
                    </p>
                </div>
                <div className={styles.body}>
                    <p className={`${styles.name} text text_type_main-medium`}>{order.name}</p>
                    {showStatus && <p className={`${statusClass} text text_type_main-small`}>{statusTextMap[order.status]}</p>}
                </div>
                <div className={styles.ingredientsRow}>
                    <div className={styles.ingredientsPreview}>
                        {visibleIngredients.map((ingredient, index) => {
                            const isLastVisible = index === visibleIngredients.length - 1;
                            const shouldShowOverlay = isLastVisible && hiddenCount > 0;
                            const zIndex = visibleIngredients.length - index;
                            return (
                                <div
                                    className={styles.ingredientItem}
                                    key={`${ingredient.id}-${index}`}
                                    style={{ zIndex }}
                                >
                                    <img src={ingredient.images.image_mobile} alt={ingredient.name} className={styles.ingredientImage} />
                                    {shouldShowOverlay && (
                                        <span className={`${styles.ingredientOverlay} text text_type_main-small`}>+{hiddenCount}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className={`${styles.price} text text_type_digits-default`}>
                        <span>{totalPrice}</span>
                        <CurrencyIcon type="primary" />
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default OrderCard;
