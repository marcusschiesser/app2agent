"use client";

import { Headphones } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <Headphones className="w-8 h-8 text-blue-900" />
      <span className="text-xl font-bold text-blue-900">app2agent</span>
    </div>
  );
}
