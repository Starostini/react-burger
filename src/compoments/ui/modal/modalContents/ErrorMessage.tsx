import React from "react";
import stylesErrorMessage from "./errorMessage.module.css";
type ErrorMessageProps = {
  message: string | null;
};
const ErrorMessage = ({
  message = "Произошла ошибка! Попробуйте обновить страницу.",
}: ErrorMessageProps) => {
  return (
    <div className={stylesErrorMessage.container}>
      <p className="text text_type_main-medium text_color_inactive">
        {message}
      </p>
    </div>
  );
};

export default ErrorMessage;
