"use client";

import { Code2, Mic, LineChart } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Mic,
    title: "Instant User Support",
    description:
      "Answer any user question about your low-code app instantly through natural voice conversations, eliminating frustration and reducing support tickets.",
    gradient: "from-purple-600 to-pink-400",
    delay: 0.2,
  },
  {
    icon: LineChart,
    title: "Reduce Onboarding & Support Costs",
    description:
      "Cut training and support expenses significantly by automating responses to common questions and providing 24/7 assistance to your app users.",
    gradient: "from-emerald-600 to-green-400",
    delay: 0.3,
  },
  {
    icon: Code2,
    title: "Simple Integration, No Coding",
    description:
      "Just upload your app's FAQ and integrate the AI voice assistant in minutes—no programming skills required, perfect for low-code environments.",
    gradient: "from-amber-600 to-yellow-400",
    delay: 0.4,
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-conic from-sky-300/40 via-blue-300/20 to-purple-300/40 blur-3xl rounded-full opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-blue-200">
            Maximize User Satisfaction
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Empower your users to understand your low-code app — let our AI
            assistant guide them instantly
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300 group hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
            >
              <div
                className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.gradient} p-0.5 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg w-full h-full flex items-center justify-center">
                  <feature.icon
                    className={`w-6 h-6 ${feature.gradient.split(" ")[0].replace("from-", "text-")}`}
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-violet-600 transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
