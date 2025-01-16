import { Bot, Code2, Mic, LineChart } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Natural Voice Interaction",
    description:
      "Control any web app with voice commands - from simple navigation to complex workflows. Speak naturally and get things done.",
  },
  {
    icon: Bot,
    title: "Intelligent App Assistant",
    description:
      "AI agent learns from your documentation to provide accurate guidance and execute complex tasks through voice commands.",
  },
  {
    icon: Code2,
    title: "10-Minute Setup",
    description:
      "Install our browser extension and upload your documentation. No coding required, works instantly with any web application.",
  },
  {
    icon: LineChart,
    title: "Continuous Learning",
    description:
      "The AI assistant improves over time based on user interactions and feedback, becoming more helpful and accurate.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Why Choose app2agent?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
