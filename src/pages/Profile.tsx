//@ts-expect-error React issue
import React from "react";
import type { ReactNode } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../services/hooks.ts";
import { logoutUser } from "../services/userActions";
import { userError, userLoading } from "../services/selectors";
import styles from "./ProfileStyle.module.css";

const navClassName = ({ isActive }: { isActive: boolean }) =>
    `${styles.link} text text_type_main-medium text_color_inactive ${isActive ? styles.linkActive : ""}`.trim();

const Profile = () => {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(userLoading);
    const error = useAppSelector(userError);

    const handleLogout = () => {
        dispatch(logoutUser())
            .unwrap()
    };

    return (
        <div className={`${styles.page} pt-20`}>
            <aside className={styles.sidebar}>
                <nav className={styles.nav}>
                    <NavLink to="/profile" end className={navClassName}>
                        Профиль
                    </NavLink>
                    <NavLink to="/profile/orders" className={navClassName}>
                        История заказов
                    </NavLink>
                    <button
                        type="button"
                        className={`${styles.link} text text_type_main-medium text_color_inactive ${styles.logoutButton}`}
                        onClick={handleLogout}
                        disabled={isLoading}
                    >
                        Выход
                    </button>
                </nav>
                {error && <p className={`${styles.error} text text_type_main-small mt-4`}>{error}</p>}
                <p className={`${styles.description} text text_type_main-default text_color_inactive mt-20`}>
                    В этом разделе вы можете изменить свои персональные данные.
                </p>
            </aside>
            <section className={styles.content}>
                <Outlet />
            </section>
        </div>
    );
};

export default Profile;

export const ProfileContainer = ({ children }: { children: ReactNode }) => {
    return <div className={styles.formWrapper}>{children}</div>;
};
