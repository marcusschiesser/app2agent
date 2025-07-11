import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Testimonial from "./components/Testimonial";
import Platforms from "./components/Platforms";
import EmailSignup from "./components/EmailSignup";
import Footer from "./components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "app2agent - Add a configurable voice agent to any website",
  description:
    "App2Agent adds a configurable voice agent to any website. It is build using the Live API from LLamaIndexTS.",
  keywords: [
    "voice agent",
    "website",
    "AI voice assistant",
    "LLamaIndexTS",
    "real-time conversations",
  ],
  authors: [{ name: "app2agent Team" }],
  openGraph: {
    title: "app2agent - Add a configurable voice agent to any website",
    description:
      "App2Agent adds a configurable voice agent to any website. It is build using the Live API from LLamaIndexTS.",
    type: "website",
    locale: "en_US",
    siteName: "app2agent",
  },
  twitter: {
    card: "summary_large_image",
    title: "app2agent - Add a configurable voice agent to any website",
    description:
      "App2Agent adds a configurable voice agent to any website. It is build using the Live API from LLamaIndexTS.",
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
          <Testimonial />
          <Platforms />
          <EmailSignup />
        </article>
      </main>
      <Footer />
    </>
  );
}
