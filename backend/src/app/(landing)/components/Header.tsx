"use client";

import Logo from "../../../components/Logo";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100/20 dark:border-gray-800/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative">
                <Logo />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-all duration-200 hover:scale-105"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Features
            </Link>

            <Link
              href="/auth"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-all duration-200 hover:scale-105"
            >
              Sign in
            </Link>
            <button
              onClick={() =>
                document
                  .getElementById("email-signup")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-blue-500 rounded-full shadow-md group"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-blue-600 to-violet-600 group-hover:translate-x-0 ease">
                <span className="mr-1">Try Now</span>
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform bg-blue-500 group-hover:translate-x-full ease">
                Get Early Access
              </span>
              <span className="relative invisible">Get Early Access</span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
          <div className="px-4 pt-2 pb-4 space-y-4">
            <Link
              href="#features"
              className="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
                setMobileMenuOpen(false);
              }}
            >
              Features
            </Link>
            <Link
              href="/auth"
              className="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign in
            </Link>
            <button
              onClick={() => {
                document
                  .getElementById("email-signup")
                  ?.scrollIntoView({ behavior: "smooth" });
                setMobileMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              Get Early Access
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
