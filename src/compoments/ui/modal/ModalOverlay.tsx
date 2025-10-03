import ReactDOM from "react-dom";
import React, { useEffect, type ReactNode } from "react";
import stylesModal from "./modal.module.css";
interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

const ModalOverlay: React.FC<ModalProps> = ({ onClose, children }) => {
  const modalRoot = document.getElementById("root-modals");
  if (!modalRoot) return null;
  return ReactDOM.createPortal(
    <div className={stylesModal.modalOverlay} onClick={onClose}>
      {children}
    </div>,
    modalRoot
  );
};

export default ModalOverlay;
