import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import UseCases from "./components/UseCases";
import EmailSignup from "./components/EmailSignup";
import Footer from "./components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "app2agent - AI Voice Assistants for Web Apps",
  description:
    "Automatically solve your users' problems with an AI voice assistant! Added to your app in minutes.",
  keywords: [
    "AI voice assistant",
    "web app support",
    "voice-first experience",
    "instant problem solving",
    "AI support",
  ],
  authors: [{ name: "app2agent Team" }],
  openGraph: {
    title: "app2agent - AI Voice Assistants for Web Apps",
    description:
      "Automatically solve your users' problems with an AI voice assistant! Added to your app in minutes.",
    type: "website",
    locale: "en_US",
    siteName: "app2agent",
  },
  twitter: {
    card: "summary_large_image",
    title: "app2agent - AI Voice Assistants for Web Apps",
    description:
      "Add AI voice assistants to your web app in minutes for automated user support.",
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
          <UseCases />
          <EmailSignup />
        </article>
      </main>
      <Footer />
    </>
  );
}
