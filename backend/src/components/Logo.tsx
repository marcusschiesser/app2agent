"use client";

import { Headphones } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="hover:opacity-80 transition-opacity">
      <div className="flex items-center gap-2">
        <Headphones className="w-8 h-8 text-blue-900" />
        <span className="text-xl font-bold text-blue-900">app2agent</span>
      </div>
    </Link>
  );
}
