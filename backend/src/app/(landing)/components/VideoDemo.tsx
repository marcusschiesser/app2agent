"use client";

import YouTube from "react-youtube";

export default function VideoDemo() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          See It in Action
        </h2>
        <div className="aspect-video w-full max-w-3xl mx-auto">
          <YouTube
            videoId="hgT6yjZoU1c"
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
    </section>
  );
}
