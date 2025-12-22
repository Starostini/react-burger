// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from "react";
import { NavLink } from "react-router-dom";
import { Logo } from "@ya.praktikum/react-developer-burger-ui-components";
import navigationStyles from "./navigation.module.css";
import CustomButton from "../ui/button/CustomButton";

const Navigation = () => {
    return (
        <nav className={navigationStyles.navigation}>
            <div className={navigationStyles.leftNav}>
                <NavLink to="/" className={navigationStyles.link} end>
                    {({ isActive }) => <CustomButton image="burger" text="Конструктор" active={isActive} />}
                </NavLink>
                <NavLink to="/feed" className={navigationStyles.link}>
                    {({ isActive }) => <CustomButton image="listIcon" text="Лента заказов" active={isActive} />}
                </NavLink>
            </div>
            <div className={navigationStyles.logoNav}>
                <NavLink to="/" className={navigationStyles.logo}>
                    <Logo />
                </NavLink>
            </div>
            <NavLink to="/profile" className={navigationStyles.link}>
                {({ isActive }) => <CustomButton image="userProfile" text="Личный кабинет" active={isActive} />}
            </NavLink>
        </nav>
    );
};

export default Navigation;
