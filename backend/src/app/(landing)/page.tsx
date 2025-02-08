import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import UseCases from "./components/UseCases";
import EmailSignup from "./components/EmailSignup";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Hero />
        <Features />
        <UseCases />
        <EmailSignup />
      </main>
      <Footer />
    </>
  );
}
