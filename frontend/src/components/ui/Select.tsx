import type { SelectHTMLAttributes } from "react";
import clsx from "clsx";
import { fieldSizeClasses } from "./sizes";
import type { FieldSize } from "./sizes";


interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  size?: FieldSize;
}

export default function Select({
  size = "md",
  className,
  ...props
}: SelectProps) {
  return (
    <select
      {...props}
      className={clsx(
        "select select-bordered w-full",
        fieldSizeClasses[size],
        className
      )}
    />
  );
}
