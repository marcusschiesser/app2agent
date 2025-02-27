import { Bot, Code2, Mic, LineChart, Users } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Specialized for Low-Code Apps",
    description:
      "AI voice assistants specifically designed to understand and support the unique needs of low-code applications and their users.",
  },
  {
    icon: Users,
    title: "Boost User Adoption",
    description:
      "Bridge the gap between app creation and usage. Help users understand how to use your app effectively, increasing adoption and reducing abandonment.",
  },
  {
    icon: Mic,
    title: "Voice-Driven IT Support",
    description:
      "Natural voice conversations that guide users through technical issues, eliminating the need for complex support tickets.",
  },
  {
    icon: Code2,
    title: "No-Code Integration",
    description:
      "Easily integrate the AI voice assistant into any app in minutes, without requiring advanced programming skills.",
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
          From App Creation to User Adoption
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
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
