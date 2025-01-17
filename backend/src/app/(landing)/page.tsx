import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import EmailSignup from "./components/EmailSignup";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Hero />
        <Features />
        <EmailSignup />
      </main>
      <Footer />
    </>
  );
}
