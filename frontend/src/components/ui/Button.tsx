import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "error" | "success";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "sm",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} ${className} btn-${size}`}
      {...props}
    >
      {children}
    </button>
  );
}
