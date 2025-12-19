import React, { useEffect, type ReactNode } from "react";
import stylesModal from "./modal.module.css";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import ModalOverlay from "./ModalOverlay";

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
    <ModalOverlay onClose={onClose}>
      <div className={stylesModal.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={`${stylesModal.modalClose} mt-15 mr-10`}
          onClick={onClose}
          data-cyid="modal-close"
        >
          <CloseIcon type="primary" />
        </button>
        {children}
      </div>
    </ModalOverlay>
  );
};

export default Modal;
