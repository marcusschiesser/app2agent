import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Testimonial from "./components/Testimonial";
import Platforms from "./components/Platforms";
import EmailSignup from "./components/EmailSignup";
import Footer from "./components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "app2agent - Solve User Adoption Challenges for OutSystems Apps",
  description:
    "Struggling with user adoption in your OutSystems app? Our AI voice assistant instantly answers any user question about your app, reducing onboarding and support costs.",
  keywords: [
    "OutSystems user adoption",
    "low-code user support",
    "AI voice assistant for OutSystems",
    "reduce app support costs",
    "low-code onboarding solution",
    "OutSystems support",
  ],
  authors: [{ name: "app2agent Team" }],
  openGraph: {
    title: "app2agent - Solve User Adoption Challenges for OutSystems Apps",
    description:
      "Struggling with user adoption? Our AI voice assistant instantly answers any user question about your OutSystems app, reducing onboarding and support costs.",
    type: "website",
    locale: "en_US",
    siteName: "app2agent",
  },
  twitter: {
    card: "summary_large_image",
    title: "app2agent - Solve User Adoption Challenges for OutSystems Apps",
    description:
      "Struggling with user adoption? Our AI voice assistant instantly answers any user question about your OutSystems app, reducing onboarding and support costs.",
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
