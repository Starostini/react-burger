import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  ConstructorElement,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./burgerConstructor.module.css";
import type { StoreIngredient } from "../Interfaces/Interfaces";

type ConstructorIngredient = StoreIngredient & { uid: string };

type DragItem = {
  uid: string;
  index: number;
  type: "CONSTRUCTOR_ITEM";
};

type ConstructorItemProps = {
  item: ConstructorIngredient;
  index: number;
  moveItem: (from: number, to: number) => void;
  onRemove: (uid: string) => void;
};

const ConstructorItem: React.FC<ConstructorItemProps> = ({
  item,
  index,
  moveItem,
  onRemove,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [, drop] = useDrop<DragItem>({
    accept: "CONSTRUCTOR_ITEM",
    hover(dragged, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = dragged.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        return;
      }
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveItem(dragIndex, hoverIndex);
      dragged.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(
    () => ({
      type: "CONSTRUCTOR_ITEM",
      item: { uid: item.uid, index, type: "CONSTRUCTOR_ITEM" },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [item.uid, index]
  );

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={styles.element}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <DragIcon type="primary" />
      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.images.image_normal}
        extraClass={`${styles.constructorItem} pl-6 pr-6 ml-2`}
        handleClose={() => onRemove(item.uid)}
      />
    </div>
  );
};

export default ConstructorItem;
