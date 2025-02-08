import { Bot, Code2, Mic, LineChart } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Instant Problem Solving",
    description:
      "AI voice assistants automatically understand and solve your users' problems, reducing support tickets and improving satisfaction.",
  },
  {
    icon: Mic,
    title: "Voice-First Experience",
    description:
      "Natural conversations with AI that guides users through complex tasks, making your web app more accessible and user-friendly.",
  },
  {
    icon: Code2,
    title: "Minutes to Deploy",
    description:
      "Add the AI voice assistant to your web app in minutes. No complex integration - just install app2agent and you're ready to go.",
  },
  {
    icon: LineChart,
    title: "Self-Improving",
    description:
      "The AI assistant learns from every interaction, continuously getting better at solving your users' specific problems.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Empower Your Web App with AI Voice Support
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
