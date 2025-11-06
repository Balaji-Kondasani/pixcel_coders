import { Users, BrainCircuit, Trophy } from 'lucide-react';

const features = [
    {
        icon: <Users className="h-6 w-6" />,
        title: "Real-Time Collaboration",
        description: "Code together in real-time with multi-user editing, shared terminals, and integrated chat. Perfect for pair programming and team projects."
    },
    {
        icon: <BrainCircuit className="h-6 w-6" />,
        title: "AI-Driven Assistance",
        description: "Get smart code completions, contextual hints, and automated debugging from our advanced AI, powered by Hugging Face models."
    },
    {
        icon: <Trophy className="h-6 w-6" />,
        title: "Gamification & Rewards",
        description: "Earn badges, climb leaderboards, and even receive Ethereum token rewards for solving challenges and contributing to the community."
    }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-[#0e1119]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Why Choose Pixcel Coders?</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Everything you need to write better code, faster, together.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/20">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600/20 text-blue-400 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;