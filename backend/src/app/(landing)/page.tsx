import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import EmailSignup from "./components/EmailSignup";
import Footer from "./components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "app2agent - Boost User Adoption for Low-Code Apps",
  description:
    "Bridge the gap between low-code app creation and user adoption. It's easy to build apps, but how do users know how to use them? Our AI voice assistant is the answer.",
  keywords: [
    "low-code user adoption",
    "voice-based IT support",
    "low-code apps",
    "AI voice assistant",
    "user onboarding",
    "no-code support",
  ],
  authors: [{ name: "app2agent Team" }],
  openGraph: {
    title: "app2agent - Boost User Adoption for Low-Code Apps",
    description:
      "Bridge the gap between app creation and user adoption. It's easy to build low-code apps, but how do users know how to use them? Our AI voice assistant is the answer.",
    type: "website",
    locale: "en_US",
    siteName: "app2agent",
  },
  twitter: {
    card: "summary_large_image",
    title: "app2agent - Boost User Adoption for Low-Code Apps",
    description:
      "Bridge the gap between app creation and user adoption. It's easy to build low-code apps, but how do users know how to use them? Our AI voice assistant is the answer.",
    creator: "@app2agent",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <article>
          <Hero />
          <Features />
          <EmailSignup />
        </article>
      </main>
      <Footer />
    </>
  );
}
