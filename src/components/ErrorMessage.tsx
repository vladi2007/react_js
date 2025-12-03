import React from "react";

interface Props {
  message?: string;
}

const ErrorMessage: React.FC<Props> = ({ message }) => {
  if (!message) return null;

  return <p className="input-error">{message}</p>;
};

export default ErrorMessage;
