import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "error" | "success";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
    className={`
        px-4 py-2 rounded-xl text-sm font-medium
        transition-all duration-150
        neu
        hover:scale-[1.02]
        active:neu-inset
        btn = ${variant}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
