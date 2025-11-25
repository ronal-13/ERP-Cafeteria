import React from "react";

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  type = "button",
  className = "",
}) => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    success: "btn-success",
    danger: "btn-danger",
    warning: "btn-warning",
  };

  const sizes = {
    small: "btn-sm",
    medium: "btn-md",
    large: "btn-lg",
  };

  const classes = [
    "btn",
    variants[variant] || variants.primary,
    sizes[size] || sizes.medium,
    disabled ? "is-disabled" : "",
    className,
  ].join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
