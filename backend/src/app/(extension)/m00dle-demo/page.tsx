import Link from "next/link";
import { Search, ChevronDown, FileText } from "lucide-react";
import Script from "next/script";
import { VideoPlayer } from "./components/video-player";

function Header() {
  return (
    <header className="border-b">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-8">
          <Link href="/demo" className="text-lg font-semibold">
            Demo University
          </Link>
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link href="/" className="hover:text-gray-600">
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Search className="w-5 h-5" />
          </button>

          <button className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded">
            <span className="text-sm">English (United States) (en_us)</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <div className="text-sm text-gray-600">
            You are currently using guest access
          </div>
        </div>
      </div>
    </header>
  );
}

export default function DemoPage() {
  return (
    <div>
      <Script
        src="/extension/inject/inject.js"
        data-top="4rem"
        data-theme="tutor"
        data-api-key="d9892300-d672-436d-adf9-b67afa7a61dc"
      />
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <nav className="mb-6 text-sm breadcrumbs">
          <div className="flex gap-2 text-gray-600">
            <Link href="/demo" className="hover:text-gray-900">
              Online Lectures
            </Link>
            <span>/</span>
            <span className="text-gray-900">
              Think Fast, Talk Smart: Communication Techniques
            </span>
          </div>
        </nav>

        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-[#06b6d4]" />
          <h1 className="text-[#0f172a] text-[32px] leading-10">
            Think Fast, Talk Smart: Communication Techniques
          </h1>
        </div>

        <div className="mb-6">
          <div className="inline-block bg-[#f8f9fa] rounded px-3 py-1.5 text-sm text-gray-600 mb-4">
            View
          </div>

          <p className="mb-4">
            In October of 2014, Matt Abrahams, a lecturer of strategic
            communication at Stanford Graduate School of Business, gave a
            lecture at Alumni Weekend.
            <br />
            <br />
            Communication is critical to success in business and in life. In
            this talk, you will learn techniques that will help you speak with
            greater confidence and clarity.
          </p>

          <VideoPlayer src="https://www.youtube.com/embed/HAnw168huqA" />
        </div>
      </div>
    </div>
  );
}
