"use client";

import { RiCustomerServiceFill } from "react-icons/ri";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <RiCustomerServiceFill className="w-8 h-8 text-blue-900" />
      <span className="text-xl font-bold text-blue-900">app2agent</span>
    </div>
  );
}
