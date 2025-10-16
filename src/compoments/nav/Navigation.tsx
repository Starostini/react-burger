// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from "react";
import { Logo } from "@ya.praktikum/react-developer-burger-ui-components";
import navigationStyles from "./navigation.module.css";
import CustomButton from "../ui/button/CustomButton";
const Navigation = () => {
  return (
    <nav className={navigationStyles.navigation}>
      <div className={navigationStyles.leftNav}>
        <CustomButton image="burger" text="Конструктор" onClick={() => {}} />
        <CustomButton
          image="listIcon"
          text="Лента заказов"
          onClick={() => {}}
        />
      </div>
      <div className={navigationStyles.logoNav}>
        <a href="#!" className={navigationStyles.logo}>
          <Logo />
        </a>
      </div>
      <CustomButton
        image="userProfile"
        text="Личный кабинет"
        onClick={() => {}}
      />
    </nav>
  );
};

export default Navigation;
