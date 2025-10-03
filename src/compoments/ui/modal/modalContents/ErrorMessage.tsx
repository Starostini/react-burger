import React from "react";
type ErrorMessageProps = {
  message: string;
};
const ErrorMessage = ({
  message = "Произошла ошибка! Попробуйте обновить страницу.",
}: ErrorMessageProps) => {
  return (
    <div style={{ padding: 40, margin: 40 }}>
      <p className="text text_type_main-medium text_color_inactive">
        {message}
      </p>
    </div>
  );
};

export default ErrorMessage;
