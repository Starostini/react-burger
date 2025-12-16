//@ts-expect-error React issue
import React, { useState } from "react";
import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import stylesCustomButton from "./customButton.module.css";

type ImageKey = "burger" | "listIcon" | "userProfile";

interface CustomButtonProps {
  image: ImageKey;
  text: string;
  active?: boolean;
  className?: string;
}

const CustomButton = ({ image, text, active = false, className = "" }: CustomButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const images: Record<ImageKey, JSX.Element> = {
    burger: <BurgerIcon type={hovered ? "primary" : "secondary"} />,
    listIcon: <ListIcon type={hovered ? "primary" : "secondary"} />,
    userProfile: <ProfileIcon type={hovered ? "primary" : "secondary"} />,
  };

  const classes = [stylesCustomButton.link, className, active ? stylesCustomButton.linkActive : ""].filter(Boolean).join(" ");

  return (
    <div
      className={`${classes} pr-5 pl-5 pt-4 pb-4`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className={stylesCustomButton.icon}>{images[image]}</span>
      <span className={`text text_type_main-default`}>{text}</span>
    </div>
  );
};

export default CustomButton;
