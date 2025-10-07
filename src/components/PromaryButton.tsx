"use client";
import React from "react";
import clsx from "clsx";
import { ImSpinner3 } from "react-icons/im";

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  isLoading = false,
  className = "",
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={clsx(
        "primary-hover",
        className
      )}
    >
      {isLoading?<ImSpinner3 className="animate-spin" />: children}
    </button>
  );
};

export default PrimaryButton;
