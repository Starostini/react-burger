import React, { useState } from "react";
import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import stylesCustomButton from "./customButton.module.css";

interface CustomButtonProps {
  image: ImageKey;
  text: string;
  onClick?: () => void;
}
type ImageKey = "burger" | "listIcon" | "userProfile";

const CustomButton: React.FC<CustomButtonProps> = ({
  image,
  text,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  const images: Record<ImageKey, JSX.Element> = {
    burger: <BurgerIcon type={hovered ? "primary" : "secondary"} />,
    listIcon: <ListIcon type={hovered ? "primary" : "secondary"} />,
    userProfile: <ProfileIcon type={hovered ? "primary" : "secondary"} />,
  };

  const handleButtonClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <a
      href="#!"
      className={`${stylesCustomButton.link} pr-5 pl-5 pt-4 pb-4`}
      onClick={handleButtonClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className={stylesCustomButton.icon}>{images[image]}</span>
      <span className={`text text_type_main-default`}>{text}</span>
    </a>
  );
};

export default CustomButton;
