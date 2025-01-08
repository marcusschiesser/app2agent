import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import EmailSignup from "./components/EmailSignup";
import VideoDemo from "./components/VideoDemo";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Hero />
        <VideoDemo />
        <Features />
        <EmailSignup />
      </main>
      <footer className="container mx-auto px-4 max-w-6xl py-8">
        <p className="text-center text-gray-600 text-sm">
          © 2025 Schiesser IT LLC. All rights reserved.
        </p>
      </footer>
    </>
  );
}
