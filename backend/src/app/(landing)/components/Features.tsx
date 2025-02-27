"use client";

import { Bot, Code2, Mic, LineChart, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Bot,
    title: "Specialized for Low-Code Apps",
    description:
      "AI voice assistants specifically designed to understand and support the unique needs of low-code applications and their users.",
    gradient: "from-blue-600 to-sky-400",
    delay: 0.1,
  },
  {
    icon: Users,
    title: "Boost User Adoption",
    description:
      "Bridge the gap between app creation and usage. Help users understand how to use your app effectively, increasing adoption and reducing abandonment.",
    gradient: "from-purple-600 to-pink-400",
    delay: 0.2,
  },
  {
    icon: Mic,
    title: "Voice-Driven IT Support",
    description:
      "Natural voice conversations that guide users through technical issues, eliminating the need for complex support tickets.",
    gradient: "from-emerald-600 to-green-400",
    delay: 0.3,
  },
  {
    icon: Code2,
    title: "No-Code Integration",
    description:
      "Easily integrate the AI voice assistant into any app in minutes, without requiring advanced programming skills.",
    gradient: "from-amber-600 to-yellow-400",
    delay: 0.4,
  },
  {
    icon: LineChart,
    title: "Self-Improving",
    description:
      "The AI assistant learns from every interaction, continuously getting better at solving your users' specific problems.",
    gradient: "from-red-600 to-orange-400",
    delay: 0.5,
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-gray-50/50 dark:bg-gray-900/50 relative overflow-hidden"
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
            From App Creation to User Adoption
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our AI assistant transforms how users interact with your low-code
            applications
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
