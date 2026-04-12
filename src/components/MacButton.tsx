"use client";

import React from "react";

export function MacButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={
        "border border-black px-3 py-1 text-xs bg-[#e0e0e0] active:translate-x-[1px] active:translate-y-[1px] " +
        className
      }
    />
  );
}
