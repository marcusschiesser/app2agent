"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, PlayCircle } from "lucide-react";
import { useState } from "react";
import VideoModal from "./VideoModal";
import Image from "next/image";

export default function Hero() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
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
              <span>Struggling with User Satisfaction in OutSystems Apps?</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-blue-200">
              Voice-Based IT Support for Low-Code Apps
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">
              Instantly answers any user question, reduces onboarding time, and
              cuts support costs — no coding required.
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
                onClick={openVideoModal}
                className="hidden md:inline-flex items-center justify-center px-6 py-4 font-medium text-gray-800 dark:text-white transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 group"
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
            <motion.div
              className="relative aspect-video flex items-center justify-center cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openVideoModal}
            >
              <Image
                src="/video_thumbnail.png"
                alt="Video thumbnail"
                className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
                width={780}
                height={480}
              />
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
                  Watch: Outsystems App with IT-support
                </h3>
                <p className="text-blue-700">1:07 min</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={closeVideoModal}
        videoId="AbTvlj_eSJc"
      />
    </section>
  );
}
