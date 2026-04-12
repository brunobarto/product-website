"use client";

import React from "react";

export function MacWindow({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-black bg-[#f5f5f5] shadow-[3px_3px_0_0_#000] font-mac text-xs">
      <div className="flex items-center justify-between px-2 py-1 border-b border-black bg-[#dcdcdc]">
        <span className="font-bold">{title}</span>
        <div className="w-3 h-3 border border-black bg-white" />
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}
