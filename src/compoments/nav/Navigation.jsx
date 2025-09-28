import React from "react";
import AppHeader from "../header/AppHeader";
import { Logo } from "@ya.praktikum/react-developer-burger-ui-components";
import navigationStyles from "./navigation.module.css";
import CustomButton from "../ui/button/CustomButton";
const Navigation = () => {
  return (
    <nav className={navigationStyles.navigation}>
      <div className={navigationStyles.leftNav}>
        <CustomButton image="burger" text="Конструктор" />
        <CustomButton image="listIcon" text="Лента заказов" />
      </div>
      <div className={navigationStyles.logoNav}>
        <a href="#!" className={navigationStyles.logo}>
          <Logo />
        </a>
      </div>
      <CustomButton image="userProfile" text="Личный кабинет" />
    </nav>
  );
};

export default Navigation;
