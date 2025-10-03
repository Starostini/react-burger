import React, { useState, useEffect } from "react";
import stylesBurgerConstructor from "./burgerConstructor.module.css";
import {
  ConstructorElement,
  DragIcon,
  Button,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
interface Ingredient {
  uid?: string;
  name: string;
  price: number;
  type: string;
  position?: string;
  images: {
    image_normal: string;
  };
}

interface BurgerConstructorProps {
  buns: Ingredient[];
  props: Ingredient[];
  onOrder: () => void;
}
const BurgerConstructor: React.FC<BurgerConstructorProps> = ({
  buns,
  props,
  onOrder,
}) => {
  const [summ, setSumm] = useState(0);
  const [list, setList] = useState<Ingredient[]>([]);
  useEffect(() => {
    setList(props);
    if (props.length > 0 || buns.length > 0) {
      const total = props.reduce((acc, item) => acc + item.price, 0);
      const bunsTotal = buns.length > 0 ? buns[0].price : 0;
      setSumm(total + bunsTotal);
    } else {
      setSumm(0);
    }
  }, [buns, props]);

  return (
    <section className={`${stylesBurgerConstructor.container} mt-25 ml-4`}>
      <div className="ml-8 mb-4">
        <ConstructorElement
          type="top"
          isLocked={true}
          text={buns.length > 0 ? buns[0].name : "Выберите булку"}
          price={buns.length > 0 ? buns[0].price : 0}
          thumbnail={
            buns.length > 0
              ? buns[0].images.image_normal
              : "/images/N-200inormal.png"
          }
        />
      </div>
      {list.length > 0 && (
        <div className={stylesBurgerConstructor.line}>
          {list.map((item) => {
            return (
              <div
                className={stylesBurgerConstructor.element}
                key={`${item.uid}-div`}
              >
                {item.type !== "buns" && <DragIcon type="primary" />}
                <ConstructorElement
                  key={item.uid}
                  type={
                    item.position
                      ? (item.position as "top" | "bottom")
                      : undefined
                  }
                  isLocked={item.position ? true : false}
                  text={item.name}
                  price={item.price}
                  thumbnail={item.images.image_normal}
                  extraClass={"pl-6 pr-6 ml-2"}
                />
              </div>
            );
          })}
        </div>
      )}
      <div className="ml-8 mt-4">
        <ConstructorElement
          type="bottom"
          isLocked={true}
          text={buns.length > 0 ? buns[1].name : "Выберите булку"}
          price={buns.length > 0 ? buns[1].price : 0}
          thumbnail={
            buns.length > 0
              ? buns[1].images.image_normal
              : "/images/N-200inormal.png"
          }
        />
      </div>
      {summ > 0 && (
        <div className={`${stylesBurgerConstructor.order} mt-10 mr-4`}>
          <div>
            <span className="text text_type_digits-medium mr-2">{summ}</span>
            <CurrencyIcon type="primary" />
          </div>
          <Button
            htmlType="button"
            type="primary"
            size="large"
            onClick={onOrder}
          >
            Оформить заказ
          </Button>
        </div>
      )}
    </section>
  );
};

export default BurgerConstructor;
