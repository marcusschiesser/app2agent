"use client";

import YouTube from "react-youtube";

export default function UseCases() {
  return (
    <section className="py-20 bg-blue-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Explore Use Cases
          </h2>
          <p className="text-xl text-blue-700 max-w-2xl mx-auto">
            See how app2agent transforms different applications with AI voice
            assistants
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="relative rounded-lg overflow-hidden mb-4">
              <div className="aspect-video">
                <YouTube
                  videoId="gfQyuHSQE1I"
                  className="w-full h-full"
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: {
                      autoplay: 0,
                      modestbranding: 1,
                      rel: 0,
                    },
                  }}
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              Online Learning Assistant
            </h3>
            <p className="text-blue-700">
              Transform learning managment systems with an AI voice tutor that
              helps students understand complex topics and answers their
              questions in real-time.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="relative rounded-lg overflow-hidden mb-4">
              <div className="aspect-video">
                <YouTube
                  videoId="tIX_qZDNghI"
                  className="w-full h-full"
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: {
                      autoplay: 0,
                      modestbranding: 1,
                      rel: 0,
                    },
                  }}
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              IT Support Assistant
            </h3>
            <p className="text-blue-700">
              Streamline IT support with an AI voice assistant that guides users
              through technical issues and provides instant solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
