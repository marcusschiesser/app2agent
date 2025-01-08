import { FaRobot, FaCode, FaMicrophone, FaChartLine } from "react-icons/fa";

const features = [
  {
    icon: FaRobot,
    title: "24/7 App Support",
    description:
      "Intelligent agent that learns from your documentation to provide accurate app support 24/7",
  },
  {
    icon: FaMicrophone,
    title: "Voice Navigation",
    description: "Navigate the app based on user goals using voice commands",
  },
  {
    icon: FaCode,
    title: "No-Code Integration",
    description:
      "Add to your existing web app without writing a single line of code using a browser extension",
  },

  {
    icon: FaChartLine,
    title: "Feedback",
    description: "Gather anonymous feedback from users to improve the agent",
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
