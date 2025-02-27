"use client";

import YouTube from "react-youtube";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, PlayCircle } from "lucide-react";
import { useState, useRef } from "react";

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<YouTube | null>(null);

  const videoOptions = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      controls: 1,
      rel: 0,
    },
  };

  const onReady = (event: { target: YouTube }) => {
    playerRef.current = event.target;
  };

  const playVideo = () => {
    setIsPlaying(true);
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="text-left lg:pr-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full">
              <Sparkles size={16} className="mr-2" />
              <span>AI Voice Assistants for Web Apps</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-blue-200">
              Voice-Based IT Support for Low-Code Apps
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">
              Boost user adoption and reduce support costs for your low-code
              apps.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <motion.button
                onClick={() =>
                  document
                    .getElementById("email-signup")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center justify-center px-6 py-4 font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Try app2agent
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </motion.button>

              <motion.button
                onClick={playVideo}
                className="inline-flex items-center justify-center px-6 py-4 font-medium text-gray-800 dark:text-white transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Watch Demo
                <PlayCircle
                  size={18}
                  className="ml-2 group-hover:text-blue-500 transition-colors"
                />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            id="demo-video"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-2xl border border-blue-100 bg-white"
          >
            {!isPlaying ? (
              <motion.div
                className="relative aspect-video bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={playVideo}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <PlayCircle className="h-10 w-10 text-white" />
                  </motion.div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-xl font-semibold text-blue-900">
                    Watch: AI Powered Support for Low-Code Apps
                  </h3>
                  <p className="text-blue-700">2:15 min</p>
                </div>
              </motion.div>
            ) : (
              <div className="aspect-video">
                <YouTube
                  videoId="tIX_qZDNghI"
                  opts={videoOptions}
                  onReady={onReady}
                  className="w-full h-full"
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
