"use client";

import { motion } from "framer-motion";
import { Quote, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Testimonial() {
  return (
    <section className="py-20 relative overflow-hidden bg-white dark:bg-gray-950">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white dark:bg-gray-950"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:bg-blue-800 dark:opacity-5"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:bg-indigo-800 dark:opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          className="bg-white dark:bg-gray-800/50 p-10 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -top-6 left-10">
            <div className="bg-blue-600 p-3 rounded-full shadow-lg">
              <Quote className="w-6 h-6 text-white" />
            </div>
          </div>

          <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic mb-6 pt-4">
            &quot;All we needed was the material we have collected in the
            knowledge base to properly guide the user through our app!&quot;
          </blockquote>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Robert Król
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Deputy Director at the Public Procurement Office in Poland
              </p>
            </div>
            <Link
              href="https://www.linkedin.com/posts/robertkrolpl_jestem-na-etapie-rozgl%C4%85dania-si%C4%99-za-innowacjami-activity-7289911525643866112-mYks"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors self-start sm:self-center"
            >
              <span className="text-sm font-medium">View on LinkedIn</span>
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
