"use client";

import YouTube from "react-youtube";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left lg:pr-8">
            <h1 className="text-5xl font-bold mb-6">
              Voice-Based IT Support for Low-Code Apps
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Empower users of low-code apps with our AI voice assistant. Boost
              adoption and reduce support costs.
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

          <div className="relative rounded-xl overflow-hidden shadow-2xl bg-blue-950/30 backdrop-blur-sm">
            <div className="aspect-video">
              <YouTube
                videoId="tIX_qZDNghI"
                className="w-full h-full"
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: {
                    autoplay: 1,
                    modestbranding: 1,
                    rel: 0,
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
