"use client";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">
            Add an AI Agent to Your App in Minutes
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Enhance your enterprise web app with an intelligent support agent
            using your existing app documentation
          </p>
          <button
            onClick={() =>
              document
                .getElementById("email-signup")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Try app2agent
          </button>
        </div>
      </div>
    </section>
  );
}
