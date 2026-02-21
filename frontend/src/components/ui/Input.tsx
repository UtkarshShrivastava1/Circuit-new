import type { InputHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { fieldSizeClasses } from "./sizes";
import type { FieldSize } from "./sizes";


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  size?: FieldSize;
}

export default function Input({
  iconLeft,
  iconRight,
  size = "md",
  className,
  ...props
}: InputProps) {
  return (
    <div className="relative w-full">
      {iconLeft && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 
          text-base-content/60 pointer-events-none">
          {iconLeft}
        </span>
      )}

      <input
        {...props}
        className={clsx(
          `  w-full px-4 py-2 rounded-xl text-sm
        bg-base-100
        neu-inset
        focus:outline-none
        focus:ring-2 focus:ring-primary/40
        placeholder:text-base-content/40`,
          fieldSizeClasses[size],
          iconLeft && "pl-10",
          iconRight && "pr-10",
          className
        )}
      />

      {iconRight && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 
          text-base-content/60">
          {iconRight}
        </span>
      )}
    </div>
  );
}
