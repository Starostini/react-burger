import ReactDOM from "react-dom";
import React, { useEffect, type ReactNode } from "react";
import stylesModal from "./modal.module.css";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  useEffect(() => {
    const closeByEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", closeByEsc);

    return () => {
      document.removeEventListener("keydown", closeByEsc);
    };
  }, [onClose]);
  return (
    <div className={stylesModal.modalOverlay} onClick={onClose}>
      <div className={stylesModal.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={`${stylesModal.modalClose} mt-15 mr-10`}
          onClick={onClose}
        >
          <CloseIcon type="primary" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
