"use client";

import Logo from "../../../components/Logo";

export default function Header() {
  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>

          <nav>
            <button
              onClick={() =>
                document
                  .getElementById("email-signup")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Get Early Access
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
